const client = require('../models/esModel');
const Blog = require('../models/blogModel');
const Menu = require('../models/menuModel');
const { truncateString } = require('../utils/utils');
const catchAsync = require('../utils/catchAsync');

// 创建索引以及映射
exports.createBlogIndex = catchAsync(async (req, res) => {
  await client.indices.create({
    index: 'blogs',
    body: {
      mappings: {
        properties: {
          title: { type: 'text' }, // 文章标题
          blog_id: { type: 'text' }, // 文章id
          content: { type: 'text' }, // 文章内容
          belong_menu_id: { type: 'text' }, // 所属的菜单id，用来后续分类
        },
      },
    },
  });

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// 删除索引（会删除所有文档）
exports.deleteBlogIndex = catchAsync(async (req, res) => {
  await client.indices.delete({
    index: 'blogs',
  });

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// 初始化所有文档
exports.initAllBlogsIndex = catchAsync(async (req, res) => {
  const blogs = await Blog.find().select('_id contents title belongingMenu');
  const documents = [];
  // 数据处理
  for (let i = 0; i < blogs.length; i += 1) {
    const blog = blogs[i];
    // 构建bulk api文档格式（批量添加文档）
    const doc = {
      blog_id: blog.id,
      title: blog.title,
      content: blog.contents.replace(/\n/g, ''), // 去除所有换行符
      belong_menu_id: blog.belongingMenu,
    };
    documents.push({ index: { _index: 'blogs' } });
    documents.push(doc);
  }
  // 给所有blog创建一个es_doc_id，用于后续文档操作
  const docs = await client.bulk({ body: documents });
  docs.items.forEach((item, index) => {
    const blog = blogs[index];
    blog.es_doc_id = item.index._id;
    blog.save();
  });

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// 执行索引和文档添加操作
exports.searchDoc = catchAsync(async (req, res) => {
  const { match } = req.query;
  const response = await client.search({
    index: 'blogs',
    body: {
      query: {
        bool: {
          should: [
            {
              match: {
                title: match,
              },
            },
            {
              match: {
                content: match,
              },
            },
          ],
        },
      },
    },
  });
  const list = response.hits.hits;

  // 搜索结果可能包含其他结果，需要进行进一步筛选出只包含匹配字符的博客
  const result = [];
  const regex = new RegExp(match, 'gi');
  for (let i = 0; i < list.length; i += 1) {
    const blog = list[i]._source;
    const contentResult = blog.content.search(regex);
    const titleResult = blog.title.search(regex);
    if (contentResult !== -1 || titleResult !== -1) {
      const matchKind =
        // eslint-disable-next-line no-nested-ternary
        contentResult !== -1 // match类型
          ? titleResult !== -1
            ? 'both'
            : 'content'
          : 'title';
      let substr = '';
      if (contentResult) {
        // 只取包括自身的前10位和后10位
        substr = truncateString(blog.content, contentResult, 20, 40);
      } else {
        substr = blog.content.substring(0, 40);
      }
      result.push({
        blog_id: blog.blog_id,
        belong_menu_id: blog.belong_menu_id,
        title: blog.title,
        content: substr,
        match_kind: matchKind,
      });
    }
  }
  // 对结果进行归集，同一菜单的内容放一起
  // 先整理出包含哪些menu
  const menus = [];
  result.forEach((item) => {
    if (!menus.includes(item.belong_menu_id)) menus.push(item.belong_menu_id);
  });

  // 将每个blog放入相应menu下
  const final = [];
  const menuPromises = menus.map((menu) =>
    Menu.findById(menu).then((data) => {
      final.push({
        menu_title: data.title,
        blogs: result.filter((blog) => blog.belong_menu_id === menu),
      });
    })
  );

  await Promise.all(menuPromises);

  res.status(200).json({
    status: 'success',
    data: {
      final,
    },
  });
});
