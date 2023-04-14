import React from 'react';
import MainPage from '../pages/MainPage';
import TestPage from '../pages/TestPage';

const router = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
];

export default router;
