import React from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import { Modal, SelectWallet } from 'components';

import s from './SelectWalletModal.module.scss';

const SelectWalletModal: React.VFC = () => {
  const {
    modals: { walletConnect },
  } = useMst();

  return (
    <Modal
      visible={walletConnect.isOpen}
      onClose={walletConnect.close}
      className={s.sw_modal}
      title="Select Wallet"
      subtitle="Connect your wallet to complete transaction"
    >
      <SelectWallet />
    </Modal>
  );
};

export default observer(SelectWalletModal);
