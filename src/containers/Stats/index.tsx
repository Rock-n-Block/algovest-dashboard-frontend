import React from 'react';
import cn from 'classnames';
import Tooltip from 'rc-tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { observer } from 'mobx-react-lite';

import { addressWithDots, numbWithCommas } from 'utils';
import { contracts } from 'config';
import { useMst } from 'store';
import { useTokenBalance } from 'hooks';

import s from './Stats.module.scss';

import { Avs, Info, Eth, Copy, Usdc, Lock, Coins } from 'assets/img';

interface IStats {
  type: 'staking' | 'pool';
}

const Stats: React.VFC<IStats> = ({ type }) => {
  const { staking, pools, user } = useMst();
  const [avsBalance] = useTokenBalance(
    user.address,
    contracts.params.AVS[contracts.type].address,
    true,
  );

  const content = React.useMemo(() => {
    if (type === 'staking') {
      return {
        title: 'Staking Overview',
        subtitle: (
          <>
            Stake your AVS tokens to gain access to USDC Yield Pool while earning staking rewards on
            your locked AVS.
            <br /> The more AVS you lockup, the more USDC you can deposit to earn passive income.
          </>
        ),
        statsTitle: 'Stake’s Stats',
      };
    }
    return {
      title: 'High-Yield Pool Overview',
      subtitle:
        'Deposit USDC to start earning while enjoying built-in deposit protection. Pool More, Earn More!',
      statsTitle: 'Pool’s Stats',
    };
  }, [type]);

  const info = React.useMemo(() => {
    if (type === 'staking') {
      return (
        <div className={s.stats__info__box}>
          <div className={s.stats__info__item}>
            <div className={cn(s.stats__info__item__name, 'text-gray')}>Your AVS Balance:</div>
            <div className={s.stats__info__item__value}>
              <span className="text-500">{numbWithCommas(avsBalance)}</span>
            </div>
          </div>
          <div className={s.stats__info__item}>
            <Tooltip
              placement="left"
              animation="zoom"
              overlay={
                <span className="text-sm">
                  {numbWithCommas(staking.totalSupply)} is the total AVS available in the market.
                </span>
              }
            >
              <div className={cn(s.stats__info__item__name, 'text-gray')}>
                AVS Max Supply:
                <img src={Info} alt="" />
              </div>
            </Tooltip>
            <div className={s.stats__info__item__value}>
              <span className="text-500">{numbWithCommas(staking.totalSupply)}</span>
            </div>
          </div>
          <div className={s.stats__info__item}>
            <div className={cn(s.stats__info__item__name, 'text-gray')}>Contracts:</div>
            <div className={s.stats__info__item__value}>
              <img src={Eth} alt="" />
              <div className="text-gray">Ethereum</div>
              <CopyToClipboard text={contracts.params.BOND[contracts.type].address}>
                <span className="cursor-pointer">
                  <span className="text-500">
                    {addressWithDots(contracts.params.BOND[contracts.type].address)}
                  </span>
                  <img src={Copy} alt="" />
                </span>
              </CopyToClipboard>
            </div>
          </div>
          <div className={s.stats__info__item}>
            <Tooltip
              placement="left"
              animation="zoom"
              overlay={
                <span className="text-sm">
                  Stake your AVS and earn {+staking.apr * 100}% APR staking rewards on your Staked
                  AVS, while gaining access to yield pool.
                </span>
              }
            >
              <div className={cn(s.stats__info__item__name, 'text-gray')}>
                Staking APR:
                <img src={Info} alt="" />
              </div>
            </Tooltip>
            <div className={s.stats__info__item__value}>
              <span className="text-500">{+staking.apr * 100}%</span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={s.stats__info__box}>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}> Total Depositors:</div>
          <div className={s.stats__info__item__value}>
            <span className="text-500">{pools.totalDepositors}</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Active Deposits:</div>
          <div className={s.stats__info__item__value}>
            <img src={Usdc} alt="" />
            <span className="text-500">{(+pools.activeDeposits).toLocaleString()}</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Total Interest Payout:</div>
          <div className={s.stats__info__item__value}>
            <img src={Usdc} alt="" />
            <span className="text-500">{pools.totalInterestPayout}</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Yield Pool Available:</div>
          <div className={s.stats__info__item__value}>
            <span className="text-500">{pools.items.length} Pools</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <Tooltip
            placement="left"
            animation="zoom"
            overlay={
              <span className="text-sm">
                Choose your lockup period from available options, 8, 16 or 24 weeks.
              </span>
            }
          >
            <div className={cn(s.stats__info__item__name, 'text-gray')}>
              Lockup Period:
              <img src={Info} alt="" />
            </div>
          </Tooltip>
          <div className={s.stats__info__item__value}>
            <span className="text-500">{pools.getMaxMinPeriod} weeks</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Yield Source:</div>
          <div className={s.stats__info__item__value}>
            <img src={Avs} alt="" />
            <span className="text-500 text-gray">AlgoVest</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <Tooltip
            placement="left"
            animation="zoom"
            overlay={
              <span className="text-sm">Deposit USDC to earn up to 60% APR from yield pool.</span>
            }
          >
            <div className={cn(s.stats__info__item__name, 'text-gray')}>
              Yield APR:
              <img src={Info} alt="" />
            </div>
          </Tooltip>
          <div className={s.stats__info__item__value}>
            <span className="text-500">20% - 60% APR</span>
          </div>
        </div>
      </div>
    );
  }, [
    type,
    staking.totalSupply,
    staking.apr,
    pools.activeDeposits,
    pools.items.length,
    pools.getMaxMinPeriod,
    avsBalance,
    pools.totalInterestPayout,
    pools.totalDepositors,
  ]);

  const total = React.useMemo(() => {
    if (type === 'staking') {
      return (
        <>
          <div className={s.stats__total}>
            <div className={s.stats__total__img}>
              <img src={Coins} alt="" />
            </div>
            <div className={cn(s.stats__total__amount, 'text-600 text-ellipsis')}>
              {numbWithCommas(staking.item.amount)}
            </div>
            <div className={cn(s.stats__total__text, 'text-gray text-md')}>Total Staked AVS</div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={s.stats__total}>
          <div className={s.stats__total__img}>
            <img src={Lock} alt="" />
          </div>
          <div className={cn(s.stats__total__amount, 'text-600 text-ellipsis')}>
            {pools.totalLocked}
          </div>
          <div className={cn(s.stats__total__text, 'text-gray text-md')}>Total Value Locked</div>
        </div>
      </>
    );
  }, [type, staking.item.amount, pools.totalLocked]);

  return (
    <div className={s.stats}>
      <div className={s.stats__overview}>
        <div className={s.stats__overview__wrapper}>
          <div className={cn(s.stats__overview__title, 'text-lg text-500')}>{content.title}</div>
          <div className={cn(s.stats__overview__title, 'text-sm text-300')}>{content.subtitle}</div>
        </div>
      </div>
      <div className={s.stats__box}>
        <div className="box">
          <div className={cn(s.stats__info__title, 'text-lmd text-500')}>{content.statsTitle}</div>
          <div className={s.stats__info}>{info}</div>
        </div>
        <div className={cn(s.stats__total, 'box')}>{total}</div>
      </div>
    </div>
  );
};

export default observer(Stats);
