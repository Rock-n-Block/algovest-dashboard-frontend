import React from 'react';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';

import { Input, Button, EstimatedReward } from 'components';
import { useWalletConnectorContext } from 'services';
import { useMst } from 'store';
import { useTokenBalance, useApprove } from 'hooks';
import { contracts } from 'config';
import { checkValueDecimals } from 'utils';

import { Avs } from 'assets/img';

import s from './Stake.module.scss';

const Stake: React.VFC = () => {
  const { walletService } = useWalletConnectorContext();
  const {
    user: { address },
    modals: { walletConnect },
    staking,
  } = useMst();
  const [amount, setAmount] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [avsBalance, avsDecimals] = useTokenBalance(
    address,
    contracts.params.AVS[contracts.type].address,
    true,
  );
  const [isApproved, isApproving, handleApprove] = useApprove({
    tokenName: 'AVS',
    approvedContractName: 'BOND',
    amount,
    walletAddress: address,
  });

  const handleChangeAmount = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = checkValueDecimals(e.target.value, avsDecimals);
      setAmount(value);
    },
    [avsDecimals],
  );

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
      staking.refreshData();
    } catch (err) {
      setLoading(false);
    }
  }, [walletService, amount, staking]);

  return (
    <div className={s.stake}>
      <Input
        onChange={handleChangeAmount}
        value={amount}
        positiveOnly
        isNumber
        className={s.stake__input}
        placeholder="10,000.00"
        textSize="lg"
        prefix={
          <div className={s.stake__postfix}>
            <img src={Avs} alt="" />
            <span className="text-lmd">AVS</span>
          </div>
        }
        error={
          new BigNumber(amount).isGreaterThan(avsBalance || 0)
            ? "You don't have enough balance"
            : ''
        }
      />
      <EstimatedReward percent={6.78} amount="10,560.00" color="gray" size="mini" />
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
          disabled={new BigNumber(amount || 0).isGreaterThanOrEqualTo(avsBalance || 0)}
          loading={isLoading}
        >
          Stake
        </Button>
      ) : null}
    </div>
  );
};

export default observer(Stake);
