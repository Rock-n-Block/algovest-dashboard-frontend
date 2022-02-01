import React from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import cn from 'classnames';

import { PoolTrxTrable, StakingTrxTrable } from './components';

import s from './Transactions.module.scss';

interface ITransactions {
  type: 'staking' | 'pool';
}

const Transactions: React.VFC<ITransactions> = ({ type }) => {
  const { user, pools, staking } = useMst();
  const title = React.useMemo(() => {
    if (type === 'staking') {
      return 'Staking records';
    }
    return 'Yield Pool Records';
  }, [type]);

  if (
    !user.address ||
    (type === 'staking' && !+staking.item.amount) ||
    (type === 'pool' && !pools.deposits.length)
  ) {
    return null;
  }

  return (
    <div className={cn(s.trx, 'box box-0')}>
      <div className={cn(s.trx__title, 'text-md text-500')}>{title}</div>
      <div className={s.trx__table}>
        {type === 'staking' ? <StakingTrxTrable /> : <PoolTrxTrable />}
      </div>
    </div>
  );
};

export default observer(Transactions);
