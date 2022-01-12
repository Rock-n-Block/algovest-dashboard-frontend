import React from 'react';
import cn from 'classnames';

import { Metamask, WalletConnect, Arrow } from 'assets/img';

import s from './SelectWallet.module.scss';

const SelectWallet: React.VFC = () => {
  return (
    <div className={s.s_wallet}>
      <div className={s.s_wallet__item}>
        <div className={s.s_wallet__item__img}>
          <img src={Metamask} alt="" />
        </div>
        <span className="text-600 text-lmd">MetaMask</span>
      </div>
      <div className={s.s_wallet__item}>
        <div className={s.s_wallet__item__img}>
          <img src={WalletConnect} alt="" />
        </div>
        <span className="text-600 text-lmd">WalletConnect</span>
      </div>
      <div className={cn(s.s_wallet__quest, 'text-smd text-gray')}>New to Ethereum network?</div>
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className={cn(s.s_wallet__link, 'text-600 text-md text-black')}
      >
        <span>Learn more about Crypto Wallet</span>
        <img src={Arrow} alt="" />
      </a>
    </div>
  );
};

export default SelectWallet;
