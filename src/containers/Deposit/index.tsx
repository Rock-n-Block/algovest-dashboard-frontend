import React from 'react';

import cn from 'classnames';
import { DepositModal } from 'containers';

import { Button } from 'components';

import { useModal } from 'hooks';

import s from './Deposit.module.scss';

const Deposit: React.VFC = () => {
  const [isDepositVisible, handleOpenDeposit, handleCloseDeposit] = useModal();
  return (
    <>
      <div className={cn(s.deposit, 'box')}>
        <div className={cn(s.deposit__title, 'text-lmd')}>Deposit and EARN</div>
        <div className={cn(s.deposit__subtitle, 'text-smd text-gray')}>
          Don’t wait, start earning passive income
        </div>
        <Button color="green" className={s.deposit__btn} onClick={handleOpenDeposit}>
          Deposit USDC
        </Button>
      </div>
      <DepositModal visible={isDepositVisible} onClose={handleCloseDeposit} />
    </>
  );
};

export default Deposit;
