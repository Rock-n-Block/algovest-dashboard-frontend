import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { StakingPage, PoolPage } from 'pages/index';
import { Header } from 'containers';

export const App: FC = () => {
  return (
    <div className="">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<StakingPage />} />
          <Route path="/pool" element={<PoolPage />} />
        </Routes>
      </div>
    </div>
  );
};
