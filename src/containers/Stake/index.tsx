import React from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';

import { Button, Input } from 'components';
import { contracts } from 'config';
import { checkValueDecimals } from 'utils';

import { useApprove, useTokenBalance } from 'hooks';
import { useWalletConnectorContext } from 'services';

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
      setAmount('');
      staking.refreshData(true);
    } catch (err) {
      setLoading(false);
    }
  }, [walletService, amount, staking]);

  // const estimatedReward = React.useMemo(() => {
  //   if (new BigNumber(amount).isGreaterThan(0) && staking.apr) {
  //     return new BigNumber(amount)
  //       .plus(new BigNumber(amount).multipliedBy(new BigNumber(staking.apr)))
  //       .toFixed(3, 1);
  //   }
  //   return '0';
  // }, [amount, staking.apr]);

  const textErr = React.useMemo(() => {
    if (new BigNumber(amount).isGreaterThan(avsBalance || 0)) {
      return "You don't have enough balance";
    }
    if (new BigNumber(amount).isLessThan(staking.minAmount)) {
      return `Minimum staking amount is ${staking.minAmount}`;
    }
    return '';
  }, [amount, staking.minAmount, avsBalance]);

  return (
    <div className={cn(s.stake, 'box')}>
      <div className={cn(s.stake__title, 'text-lmd')}>Stake AVS</div>
      <div className={cn(s.stake__subtitle, 'text-smd text-gray')}>
        Enter AVS amount and earn high rewards
      </div>
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
        error={textErr}
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
          disabled={!!textErr || !amount}
          loading={isLoading}
        >
          Stake
        </Button>
      ) : null}
    </div>
  );
};

export default observer(Stake);
