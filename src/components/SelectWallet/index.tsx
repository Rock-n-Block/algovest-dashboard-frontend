import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { Metamask, WalletConnect, Arrow } from 'assets/img';
import { useWalletConnectorContext } from 'services';
import { chainsEnum } from 'typings';
import { useMst } from 'store';

import s from './SelectWallet.module.scss';

const SelectWallet: React.VFC = () => {
  const { connect } = useWalletConnectorContext();
  const {
    modals: { walletConnect },
  } = useMst();

  const handleConnect = React.useCallback(
    (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => {
      connect(chainName, providerName)
        .then(() => {
          walletConnect.close();
        })
        .catch(() => {});
    },
    [walletConnect, connect],
  );

  return (
    <div className={s.s_wallet}>
      <div
        className={s.s_wallet__item}
        onClick={() => handleConnect(chainsEnum.Ethereum, 'MetaMask')}
        onKeyDown={() => {}}
        role="button"
        tabIndex={0}
      >
        <div className={s.s_wallet__item__img}>
          <img src={Metamask} alt="" />
        </div>
        <span className="text-600 text-lmd">MetaMask</span>
      </div>
      <div
        className={s.s_wallet__item}
        onClick={() => handleConnect(chainsEnum.Ethereum, 'WalletConnect')}
        onKeyDown={() => {}}
        role="button"
        tabIndex={0}
      >
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

export default observer(SelectWallet);
