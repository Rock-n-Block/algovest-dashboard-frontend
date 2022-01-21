import React from 'react';
import cn from 'classnames';
import Pagination from 'rc-pagination';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';

import { useMst } from 'store';
import { WalletService } from 'services';

import { ArrowSort, ArrowNav } from 'assets/img';

import s from './TableTrx.module.scss';

const PoolTrx: React.VFC = () => {
  const { pools } = useMst();

  const buttonItemRender = (_: number, type: string, element: React.ReactNode) => {
    if (type === 'prev') {
      return (
        <div className={cn(s.t_table__nav, s.t_table__nav_prev)}>
          <img src={ArrowNav} alt="" />
          <span className="text-smd">Previous</span>
        </div>
      );
    }
    if (type === 'next') {
      return (
        <div className={cn(s.t_table__nav, s.t_table__nav_next)}>
          <span className="text-smd">Next</span>
          <img src={ArrowNav} alt="" />
        </div>
      );
    }
    return element;
  };

  return (
    <div className={s.t_table}>
      <div className={cn(s.t_table__head, s.t_table__pool__row, s.t_table__row)}>
        <div className={s.t_table__head__item}>
          <div className={s.t_table__head__item__controll}>
            <span>Date</span>
            <img src={ArrowSort} alt="" />
          </div>
        </div>
        <div className={s.t_table__head__item}>
          <span>Coin</span>
        </div>
        <div className={s.t_table__head__item}>
          <div className={s.t_table__head__item__controll}>
            <span>Amount</span>
            <img src={ArrowSort} alt="" />
          </div>
        </div>
        <div className={s.t_table__head__item}>
          <span>Est. APR</span>
        </div>
        <div className={s.t_table__head__item}>
          <span>Lockup period</span>
        </div>
        <div className={s.t_table__head__item}>
          <span>Cum. Interest</span>
        </div>
        <div className={s.t_table__head__item}>
          <span>Status</span>
        </div>
        <div className="" />
      </div>
      {pools.deposits.map((deposit) => (
        <div
          key={deposit.depositTimestamp}
          className={cn(s.t_table__pool__row, s.t_table__row, 'text-md')}
        >
          <div>{format(new Date(+deposit.depositTimestamp * 1000), 'dd.MM.yyyy')}</div>
          <div>USDC</div>
          <div>{WalletService.weiToEthWithDecimals(deposit.amount)}</div>
          <div className="">{deposit.pool.periodInterestRate}%</div>
          <div className="">{deposit.pool.noncesToUnlock} Weeks</div>
          <div>
            <div className="text-green">
              {WalletService.weiToEthWithDecimals(deposit.pendingInterest)}
            </div>
            <div className="text-sm text-gray">Accrue days: 5 days </div>
          </div>
          <div className={cn(s.t_table__status, s.t_table__status_active)}>Active</div>
          <div className="text-red text-smd cursor-pointer">Unstake</div>
        </div>
      ))}
      {/* <div className={cn(s.t_table__pool__row, s.t_table__row, 'text-md')}>
        <div>21. 09. 2021</div>
        <div>USDC</div>
        <div>102.50435</div>
        <div className="">40%</div>
        <div className="">8 Weeks</div>
        <div>
          <div className="text-green">0.51942</div>
          <div className="text-sm text-gray">Accrue days: 5 days </div>
        </div>
        <div className={cn(s.t_table__status, s.t_table__status_done)}>Done</div>
        <div className="text-red text-smd cursor-pointer">Unstake</div>
      </div> */}
      <Pagination simple defaultCurrent={1} total={50} itemRender={buttonItemRender} />
    </div>
  );
};

export default observer(PoolTrx);
