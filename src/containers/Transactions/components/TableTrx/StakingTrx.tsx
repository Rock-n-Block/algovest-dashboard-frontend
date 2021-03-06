import React from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import BigNumber from 'bignumber.js';
import cn from 'classnames';
import { UnstakeModal } from 'containers';
import { differenceInSeconds, format } from 'date-fns';

import { Button } from 'components';
import { numbWithCommas } from 'utils';

import { useModal } from 'hooks';

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
            <span>Start Date</span>
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
            <div className={cn(s.t_table__pool__row__data, s.t_table__staking__item)}>
              <div className={s.t_table__pool__row__name}>Start Date</div>
              <div className={s.t_table__pool__row__value}>
                {format(new Date(+staking.item.date * 1000), 'dd.MM.yyyy')}
              </div>
            </div>
            <div className={cn(s.t_table__pool__row__data, s.t_table__staking__item)}>
              <div className={s.t_table__pool__row__name}>Staked AVS</div>
              <div className={s.t_table__pool__row__value}>
                {numbWithCommas(staking.item.amount)}
              </div>
            </div>
            <div className={cn(s.t_table__pool__row__data, s.t_table__staking__item)}>
              <div className={s.t_table__pool__row__name}>Rewards Earned (AVS)</div>
              <div className={cn(s.t_table__pool__row__value, s.t_table__pool__row__value__img)}>
                <img src={Avs} alt="" />
                {rewardsEarned}
              </div>
            </div>
            <div className={s.t_table__staking__item}>
              <Button
                onClick={handleOpenUnstakeModal}
                size="small"
                color="black-outlined"
                className={s.t_table__pool__row__btn}
              >
                Unstake
              </Button>
            </div>
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
