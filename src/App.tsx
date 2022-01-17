import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

import { StakingPage, PoolPage } from 'pages/index';
import { Header, SelectWalletModal, Navbar } from 'containers';

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
