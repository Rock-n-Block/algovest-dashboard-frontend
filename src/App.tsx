import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from 'pages/index';

export const App: FC = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};
