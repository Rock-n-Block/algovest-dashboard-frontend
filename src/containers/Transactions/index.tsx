import React from 'react';
import cn from 'classnames';

import { Input, Button } from 'components';
import { PoolTrxTrable, StakingTrxTrable } from './components';

import { Search, Export } from 'assets/img';

import s from './Transactions.module.scss';

interface ITransactions {
  type: 'staking' | 'pool';
}

const Transactions: React.VFC<ITransactions> = ({ type }) => {
  const [searchValue, setSearchValue] = React.useState('');

  const title = React.useMemo(() => {
    if (type === 'staking') {
      return 'Staking Transactions';
    }
    return 'Yield Pool Transactions';
  }, [type]);

  const handleChangeSearchValue = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <div className={cn(s.trx, 'box')}>
      <div className={cn(s.trx__title, 'text-md text-500')}>{title}</div>
      <div className={s.trx__box}>
        <Input
          onChange={handleChangeSearchValue}
          value={searchValue}
          prefix={<img src={Search} alt="" />}
        />
        <Button size="big" className={s.trx__export} icon={Export}>
          Export
        </Button>
      </div>
      <div className={s.trx__table}>
        {type === 'staking' ? <StakingTrxTrable /> : <PoolTrxTrable />}
      </div>
    </div>
  );
};

export default Transactions;
