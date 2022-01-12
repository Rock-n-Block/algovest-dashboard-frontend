import React from 'react';
import cn from 'classnames';

import { Magnet } from 'assets/img';

import s from './EstimatedReward.module.scss';

interface IEstimatedReward {
  percent: string | number;
  amount: string | number;
}

const EstimatedReward: React.VFC<IEstimatedReward> = ({ percent, amount }) => {
  return (
    <div className={cn(s.e_reward, 'box-green')}>
      <img src={Magnet} alt="" />
      <div className={s.e_reward__wrapper}>
        <div className={cn(s.e_reward__subtitle, 'text-gray text-sm')}>
          {percent}% (APY) Estimated Reward:
        </div>
        <div className={cn(s.e_reward__title, 'text-600 text-lg')}>{amount}</div>
      </div>
    </div>
  );
};

export default EstimatedReward;
