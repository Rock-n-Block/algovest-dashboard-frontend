import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from 'pages/index';
import { Header } from 'containers';

export const App: FC = () => {
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};
