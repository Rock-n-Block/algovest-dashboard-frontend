import React from 'react';
import { observer } from 'mobx-react-lite';

import { Modal, Input, Button, EstimatedReward } from 'components';
import { IModalProps } from 'typings';
import { useMst } from 'store';

import { Avs } from 'assets/img';

import s from './StakeModal.module.scss';

const StakeModal: React.VFC<Pick<IModalProps, 'onClose' | 'visible'>> = ({ visible, onClose }) => {
  const {
    user: { address },
    modals: { walletConnect },
  } = useMst();
  const [amount, setAmount] = React.useState('');

  const handleChangeAmount = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Stake AVS"
      subtitle="Enter AVS amount and earn high rewards"
    >
      <Input
        onChange={handleChangeAmount}
        value={amount}
        positiveOnly
        isNumber
        className={s.stake__input}
        placeholder="10,000.00"
        postfix={
          <div className={s.stake__postfix}>
            <img src={Avs} alt="" />
            <span className="text-gray text-md">AVS</span>
          </div>
        }
        error="You don't have enough balance"
      />
      {!address ? (
        <Button color="green" className={s.stake__btn} onClick={walletConnect.open}>
          Connect Wallet
        </Button>
      ) : null}
      <EstimatedReward percent={6.78} amount="10,560.00" />
    </Modal>
  );
};

export default observer(StakeModal);
