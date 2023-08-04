const client = require('../models/esModel');
const Blog = require('../models/blogModel');
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
        },
      },
    },
  });

  res.status(204).json({
    status: 'success',
    data: {},
  });
});

// 初始化所有文档
exports.initAllBlogsIndex = catchAsync(async (req, res) => {
  // 先删除所有文档
  await client.deleteByQuery({
    index: 'blogs',
    body: {
      query: {
        match_all: {}, // 匹配所有文档
      },
    },
  });

  const blogs = await Blog.find().select('_id contents title');
  const documents = [];
  // 数据处理
  for (let i = 0; i < blogs.length; i += 1) {
    const blog = blogs[i];
    // // 构建bulk api文档格式（批量添加文档）
    const doc = { blog_id: blog.id, title: blog.title, content: blog.contents };
    documents.push({ index: { _index: 'blogs' } });
    documents.push(doc);
  }
  await client.bulk({ body: documents });

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
    const contentResult = regex.test(blog.content);
    const titleResult = regex.test(blog.title);
    if (contentResult || titleResult) {
      if (contentResult) {
        // 只取包括自身的前10位和后10位
        const substr = `...${blog.content.substring(
          regex.lastIndex - match.length - 10,
          regex.lastIndex + 10
        )}...`;

        result.push({
          blog_id: blog.blog_id,
          title: blog.title,
          content: substr,
        });
      }
    } else {
      result.push({
        blog_id: blog.blog_id,
        title: blog.title,
        content: `${blog.content.substring(0, 20)}...`,
      });
    }
  }

  // content返回相关词所在的前后一小段（不全部返回，用于搜索展示）

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});
