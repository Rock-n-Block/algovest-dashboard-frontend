import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { format, differenceInSeconds } from 'date-fns';
import BigNumber from 'bignumber.js';

import { useMst } from 'store';
import { UnstakeModal } from 'containers';
import { useModal } from 'hooks';
import { Button } from 'components';

import { Avs } from 'assets/img';

import s from './TableTrx.module.scss';

const StakingTrx: React.VFC = () => {
  const { staking } = useMst();
  const [isUnstakeModalVisible, handleOpenUnstakeModal, handleCloseUnstakeModal] = useModal(false);

  const rewardsEarned = React.useMemo(() => {
    if (+staking.item.amount) {
      const diff = differenceInSeconds(new Date(), new Date(+staking.item.date * 1000));
      return new BigNumber(staking.item.amount)
        .multipliedBy(staking.apr)
        .multipliedBy(diff)
        .dividedBy(31536000)
        .toFixed(10, 1);
    }
    return '0';
  }, [staking.item.amount, staking.item.date, staking.apr]);

  if (!+staking.item.amount) {
    return null;
  }

  return (
    <>
      <div className={s.t_table}>
        <div className={cn(s.t_table__head, s.t_table__staking__row, s.t_table__row)}>
          <div className={s.t_table__head__item}>
            <span>Date</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Staked AVS</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Rewards Earned (AVS)</span>
          </div>
          <div className="" />
        </div>
        {+staking.item.amount ? (
          <div
            className={cn(
              s.t_table__staking__row,
              s.t_table__row,
              s.t_table__staking__row__content,
              'text-md',
            )}
          >
            <div className={s.t_table__staking__item}>
              {format(new Date(+staking.item.date * 1000), 'dd.MM.yyyy')}
            </div>
            <div className={s.t_table__staking__item}>{staking.item.amount}</div>
            <div className={s.t_table__staking__item}>
              <img src={Avs} alt="" />
              {rewardsEarned}
            </div>
            <Button onClick={handleOpenUnstakeModal} size="small" color="black">
              Unstake
            </Button>
          </div>
        ) : null}
      </div>
      <UnstakeModal
        visible={isUnstakeModalVisible}
        onClose={handleCloseUnstakeModal}
        staked={staking.item.amount}
        startDate={staking.item.date}
        rewardsEarned={rewardsEarned}
      />
    </>
  );
};

export default observer(StakingTrx);
