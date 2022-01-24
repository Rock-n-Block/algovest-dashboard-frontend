import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js';

import { Modal, Steps, EstimatedReward, Input, Button } from 'components';
import { IModalProps } from 'typings';
import { useSteps, useTokenBalance, useApprove } from 'hooks';
import { useMst } from 'store';
import { IPoolItem } from 'store/Models/Pools';
import { contracts } from 'config';
import { checkValueDecimals } from 'utils';
import { useWalletConnectorContext } from 'services';

import { LockupPeriod, Usdc } from 'assets/img';

import s from './DepositModal.module.scss';

const stepsData = [
  {
    title: 'USDC Yield Pool',
    subtitle: 'Choose a pool and deposit any amount',
  },
  {
    title: 'Deposit USDC',
    subtitle: 'Enter USDC amount and earn high cumulative interest',
  },
];

const DepositModal: React.VFC<Pick<IModalProps, 'onClose' | 'visible'>> = ({
  visible,
  onClose,
}) => {
  const {
    user: { address },
    modals: { walletConnect },
    pools,
  } = useMst();
  const { walletService } = useWalletConnectorContext();

  const [isLoading, setLoading] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [currentStep, handleChangeStep] = useSteps(1);
  const [selectedPool, setPool] = React.useState<IPoolItem>(pools.items[0]);

  const [usdcBalance, usdcDecimals] = useTokenBalance(
    address,
    contracts.params.USDC[contracts.type].address,
    true,
  );

  const [isApproved, isApproving, handleApprove] = useApprove({
    tokenName: 'USDC',
    approvedContractName: 'BOND',
    amount,
    walletAddress: address,
  });

  const handleDeposit = React.useCallback(async () => {
    try {
      setLoading(true);
      const trxAmount = await walletService.calcTransactionAmount(
        contracts.params.USDC[contracts.type].address,
        amount,
      );
      await walletService.createTransaction({
        method: 'depositToPool',
        data: [selectedPool.id, trxAmount],
        contract: 'BOND',
      });
      setLoading(false);
      setAmount('');
      pools.refreshData(true);
      onClose();
    } catch (err) {
      setLoading(false);
    }
  }, [walletService, amount, pools, selectedPool, onClose]);

  const handleChangeAmount = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = checkValueDecimals(e.target.value, usdcDecimals);
      setAmount(value);
    },
    [usdcDecimals],
  );

  const handleSelectPool = React.useCallback(
    (pool: IPoolItem) => {
      setPool(pool);
      handleChangeStep(currentStep + 1);
    },
    [handleChangeStep, currentStep],
  );

  const estimatedReward = React.useMemo(() => {
    if (new BigNumber(amount).isGreaterThan(0) && selectedPool.periodInterestRate) {
      return new BigNumber(amount)
        .plus(
          new BigNumber(amount).multipliedBy(
            new BigNumber(selectedPool.periodInterestRate).dividedBy(100),
          ),
        )
        .toFixed(3, 1);
    }
    return '0';
  }, [amount, selectedPool]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={stepsData[currentStep - 1].title}
      subtitle={stepsData[currentStep - 1].subtitle}
      steps={<Steps allSteps={2} currentStep={currentStep} handleBack={handleChangeStep} />}
    >
      {currentStep === 1 ? (
        <div className={s.deposit__pools}>
          {pools.items.map((pool, index) => (
            <div
              key={`${pool.noncesToUnlock}-${pool.periodInterestRate}-${pool.minDeposit}`}
              className={cn(s.deposit__pools__item, 'box box-sm', {
                ' box-green': index === 0,
              })}
              onClick={() => handleSelectPool(pool)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className={cn(s.deposit__pools__item__title, 'text-green text-600')}>
                <span>{pool.periodInterestRate}% APR</span>
                {index === 0 ? (
                  <div className={cn(s.deposit__pools__item__recom, 'text-sm text-400')}>
                    Recommended
                  </div>
                ) : null}
              </div>
              <div className={s.deposit__pools__item__box}>
                <div className={cn(s.deposit__pools__item__period, 'text-gray text-smd')}>
                  <img src={LockupPeriod} alt="" />
                  {pool.noncesToUnlock} weeks lockup period
                </div>
                <div className={cn(s.deposit__pools__item__currency, 'text-gray text-smd')}>
                  <img src={Usdc} alt="" />
                  USDC
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {currentStep === 2 ? (
        <div className={s.deposit__box}>
          <Input
            onChange={handleChangeAmount}
            value={amount}
            positiveOnly
            isNumber
            className={s.deposit__input}
            placeholder="10,000.00"
            postfix={
              <div className={s.deposit__postfix}>
                <img src={Usdc} alt="" />
                <span className="text-gray text-md">USDC</span>
              </div>
            }
            error={
              new BigNumber(amount).isGreaterThan(usdcBalance || 0)
                ? "You don't have enough balance"
                : ''
            }
          />
          <div className={cn(s.deposit__lockup, 'text-smd text-gray')}>
            <div className={s.deposit__lockup__box}>
              <img src={LockupPeriod} alt="" />
              {selectedPool.noncesToUnlock} weeks lockup period
            </div>
            <div className="text-500">@ {selectedPool.periodInterestRate}% APR</div>
          </div>
          {!address ? (
            <Button color="green" className={s.deposit__btn} onClick={walletConnect.open}>
              Connect Wallet
            </Button>
          ) : null}
          {!isApproved && address ? (
            <Button
              color="green"
              className={s.deposit__btn}
              onClick={handleApprove}
              loading={isApproving}
            >
              Approve Token
            </Button>
          ) : null}
          {isApproved && address ? (
            <Button
              color="green"
              className={s.deposit__btn}
              onClick={handleDeposit}
              disabled={new BigNumber(amount || 0).isGreaterThanOrEqualTo(usdcBalance || 0)}
              loading={isLoading}
            >
              Deposit
            </Button>
          ) : null}
          <EstimatedReward percent={selectedPool.periodInterestRate} amount={estimatedReward} />
        </div>
      ) : null}
    </Modal>
  );
};

export default observer(DepositModal);
