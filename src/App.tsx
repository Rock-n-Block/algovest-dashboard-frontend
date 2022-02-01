import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Header, Navbar, SelectWalletModal } from 'containers';

import { PoolPage, StakingPage } from 'pages/index';

export const App: FC = () => {
  return (
    <div className="">
      <Header />
      <div className="content">
        <div className="container">
          <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<StakingPage />} />
          <Route path="/pool" element={<PoolPage />} />
        </Routes>
      </div>
      <SelectWalletModal />
    </div>
  );
};
