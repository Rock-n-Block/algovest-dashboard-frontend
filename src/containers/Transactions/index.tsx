import React from 'react';
import cn from 'classnames';

import s from './Transactions.module.scss';

const Transactions: React.VFC = () => {
  return (
    <div className={cn(s.trx, 'box')}>
      <div className={cn(s.trx__title, 'text-md text-500')}>Yield Pool Transactions</div>
    </div>
  );
};

export default Transactions;
