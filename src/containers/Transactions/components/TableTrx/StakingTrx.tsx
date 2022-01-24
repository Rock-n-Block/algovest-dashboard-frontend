import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';

import { useMst } from 'store';

import s from './TableTrx.module.scss';

const StakingTrx: React.VFC = () => {
  const { staking } = useMst();
  return (
    <div className={s.t_table}>
      <div className={cn(s.t_table__head, s.t_table__staking__row, s.t_table__row)}>
        <div className={s.t_table__head__item}>
          <span>Date</span>
        </div>
        <div className={s.t_table__head__item}>
          <span>Staked AVS</span>
        </div>
        <div className={s.t_table__head__item}>
          <span>Rewards Earned</span>
        </div>
        <div className="" />
      </div>
      <div
        className={cn(
          s.t_table__staking__row,
          s.t_table__row,
          s.t_table__staking__row__content,
          'text-md',
        )}
      >
        <div>{format(new Date(+staking.item.date * 1000), 'dd.MM.yyyy')}</div>
        <div>AVS</div>
        <div>{staking.item.amount}</div>
        <div className="text-red text-smd cursor-pointer">Unstake</div>
      </div>
    </div>
  );
};

export default observer(StakingTrx);
