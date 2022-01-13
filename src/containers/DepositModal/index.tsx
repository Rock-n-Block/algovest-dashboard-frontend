import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { Modal, Steps, EstimatedReward, Input, Button } from 'components';
import { IModalProps } from 'typings';
import { useSteps } from 'hooks';
import { useMst } from 'store';

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

interface IPool {
  apr: number;
  lockupPeriod: number;
  isRecommended?: boolean;
}

// mock
const pools: IPool[] = [
  {
    apr: 20,
    lockupPeriod: 8,
  },
  {
    apr: 40,
    lockupPeriod: 16,
    isRecommended: true,
  },
  {
    apr: 60,
    lockupPeriod: 24,
  },
];

const DepositModal: React.VFC<Pick<IModalProps, 'onClose' | 'visible'>> = ({
  visible,
  onClose,
}) => {
  const {
    user: { address },
    modals: { walletConnect },
  } = useMst();
  const [amount, setAmount] = React.useState('');
  const [currentStep, handleChangeStep] = useSteps(1);
  const [selectedPool, setPool] = React.useState<IPool>(pools[0]);
  console.log(selectedPool);

  const handleChangeAmount = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  const handleSelectPool = React.useCallback(
    (pool: IPool) => {
      setPool(pool);
      handleChangeStep(currentStep + 1);
    },
    [handleChangeStep, currentStep],
  );

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
          {pools.map((pool) => (
            <div
              key={pool.apr}
              className={cn(s.deposit__pools__item, 'box box-sm', {
                ' box-green': pool.isRecommended,
              })}
              onClick={() => handleSelectPool(pool)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className={cn(s.deposit__pools__item__title, 'text-green text-600')}>
                <span>{pool.apr}% APR</span>
                {pool.isRecommended ? (
                  <div className={cn(s.deposit__pools__item__recom, 'text-sm text-400')}>
                    Recommended
                  </div>
                ) : null}
              </div>
              <div className={s.deposit__pools__item__box}>
                <div className={cn(s.deposit__pools__item__period, 'text-gray text-smd')}>
                  <img src={LockupPeriod} alt="" />
                  {pool.lockupPeriod} weeks lockup period
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
            error="You don't have enough balance"
          />
          <div className={cn(s.deposit__lockup, 'text-smd text-gray')}>
            <div className={s.deposit__lockup__box}>
              <img src={LockupPeriod} alt="" />
              {selectedPool.lockupPeriod} weeks lockup period
            </div>
            <div className="text-500">@ {selectedPool.apr}% APR</div>
          </div>
          {!address ? (
            <Button color="green" className={s.deposit__btn} onClick={walletConnect.open}>
              Connect Wallet
            </Button>
          ) : null}
          <EstimatedReward percent={selectedPool.apr} amount="10,560.00" />
        </div>
      ) : null}
    </Modal>
  );
};

export default observer(DepositModal);
