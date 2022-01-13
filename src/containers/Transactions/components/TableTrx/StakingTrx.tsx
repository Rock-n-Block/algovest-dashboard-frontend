import React from 'react';
import cn from 'classnames';
import Pagination from 'rc-pagination';

import { ArrowSort, ArrowNav } from 'assets/img';

import s from './TableTrx.module.scss';

const StakingTrx: React.VFC = () => {
  // const [activeSort]
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
      <div className={cn(s.t_table__head, s.t_table__staking__row, s.t_table__row)}>
        <div className={s.t_table__head__item}>
          <div className={s.t_table__head__item__controll}>
            <span>Date</span>
            <img src={ArrowSort} alt="" />
          </div>
        </div>
        <div className={s.t_table__head__item}>
          <span>Tokens</span>
        </div>
        <div className={s.t_table__head__item}>
          <div className={s.t_table__head__item__controll}>
            <span>Staked AVS</span>
            <img src={ArrowSort} alt="" />
          </div>
        </div>
        <div className={s.t_table__head__item}>
          <span>Rewards Earned</span>
        </div>
        <div className="" />
      </div>
      <div className={cn(s.t_table__staking__row, s.t_table__row, 'text-md')}>
        <div>21. 09. 2021</div>
        <div>AVS</div>
        <div>1,740.00</div>
        <div>
          <div className="text-green">0.51942</div>
          <div className="text-sm text-gray">Accrue days: 5 days </div>
        </div>
        <div className="text-red text-smd cursor-pointer">Unstake</div>
      </div>
      <div className={cn(s.t_table__staking__row, s.t_table__row, 'text-md')}>
        <div>21. 09. 2021</div>
        <div>AVS</div>
        <div>1,740.00</div>
        <div>
          <div className="text-green">0.51942</div>
          <div className="text-sm text-gray">Accrue days: 5 days </div>
        </div>
        <div className="text-gray text-smd cursor-pointer">Paid out</div>
      </div>
      <Pagination simple defaultCurrent={1} total={50} itemRender={buttonItemRender} />
    </div>
  );
};

export default StakingTrx;
