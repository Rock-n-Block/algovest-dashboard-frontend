import React from 'react';
import cn from 'classnames';

import { Input, Button } from 'components';
import { PoolTrxTrable, StakingTrxTrable } from './components';
import { useWindowSize } from 'hooks';

import { Search, Export, ExportW } from 'assets/img';

import s from './Transactions.module.scss';

interface ITransactions {
  type: 'staking' | 'pool';
}

const Transactions: React.VFC<ITransactions> = ({ type }) => {
  const [searchValue, setSearchValue] = React.useState('');
  const { width } = useWindowSize();

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
        <Button
          size="big"
          className={s.trx__export}
          icon={width < 1000 ? ExportW : Export}
          color={width < 1000 ? 'black' : 'gray'}
          rounded={width < 1000}
        >
          {width < 1000 ? '' : 'Export'}
        </Button>
      </div>
      <div className={s.trx__table}>
        {type === 'staking' ? <StakingTrxTrable /> : <PoolTrxTrable />}
      </div>
    </div>
  );
};

export default Transactions;
