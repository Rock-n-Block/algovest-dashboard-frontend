import React from 'react';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';

import { Modal, Input, Button, EstimatedReward } from 'components';
import { useWalletConnectorContext } from 'services';
import { IModalProps } from 'typings';
import { useMst } from 'store';
import { useTokenBalance, useApprove } from 'hooks';
import { contracts } from 'config';

import { Avs } from 'assets/img';

import s from './StakeModal.module.scss';

const StakeModal: React.VFC<Pick<IModalProps, 'onClose' | 'visible'>> = ({ visible, onClose }) => {
  const { walletService } = useWalletConnectorContext();
  const {
    user: { address },
    modals: { walletConnect },
  } = useMst();
  const [amount, setAmount] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const avsBalance = useTokenBalance(address, contracts.params.AVS[contracts.type].address, true);
  const [isApproved, isApproving, handleApprove] = useApprove({
    tokenName: 'AVS',
    approvedContractName: 'BOND',
    amount,
    walletAddress: address,
  });

  const handleChangeAmount = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  const handleStake = React.useCallback(async () => {
    try {
      setLoading(true);
      const trxAmount = await walletService.calcTransactionAmount(
        contracts.params.AVS[contracts.type].address,
        amount,
      );
      await walletService.createTransaction({
        method: 'depositAvsToken',
        data: [trxAmount],
        contract: 'BOND',
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [walletService, amount]);

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
        error={
          new BigNumber(amount).isGreaterThan(avsBalance) ? "You don't have enough balance" : ''
        }
      />
      {!address ? (
        <Button color="green" className={s.stake__btn} onClick={walletConnect.open}>
          Connect Wallet
        </Button>
      ) : null}
      {!isApproved && address ? (
        <Button
          color="green"
          className={s.stake__btn}
          onClick={handleApprove}
          loading={isApproving}
        >
          Approve Token
        </Button>
      ) : null}
      {isApproved && address ? (
        <Button
          color="green"
          className={s.stake__btn}
          onClick={handleStake}
          disabled={new BigNumber(amount).isGreaterThan(avsBalance)}
          loading={isLoading}
        >
          Stake
        </Button>
      ) : null}
      <EstimatedReward percent={6.78} amount="10,560.00" />
    </Modal>
  );
};

export default observer(StakeModal);
