import React from 'react';
import cn from 'classnames';
import Tooltip from 'rc-tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Button } from 'components';
import { addressWithDots } from 'utils';

import s from './Stats.module.scss';

import { ArrowGreen, Avg, Info, Eth, Copy, Usdc } from 'assets/img';

interface IStats {
  type: 'staking' | 'pool';
}

const Stats: React.VFC<IStats> = ({ type }) => {
  const content = React.useMemo(() => {
    if (type === 'staking') {
      return {
        title: 'Staking Overview',
        subtitle: (
          <>
            Stake your AVS tokens to gain access to USDC Yield Pool while earning staking rewards{' '}
            <br />
            on your locked AVS. The more AVS you lockup, the more USDC you can deposit to earn
            passive income.
          </>
        ),
        btnText: 'Stake AVS',
        statsTitle: 'Stake’s Stats',
      };
    }
    return {
      title: 'High-Yield Pool Overview',
      subtitle:
        'Deposit USDC to start earning while enjoying built-in deposit protection. Pool More, Earn More!',
      btnText: 'Deposit USDC',
      statsTitle: 'Pool’s Stats',
    };
  }, [type]);

  const info = React.useMemo(() => {
    if (type === 'staking') {
      return (
        <>
          <div className={s.stats__info__item}>
            <div className={cn(s.stats__info__item__name, 'text-gray')}>No. of AVS Stakers:</div>
            <div className={s.stats__info__item__value}>
              <img src={ArrowGreen} alt="" />
              <div className="text-green">4.43%</div>
              <span className="text-500">14,302</span>
            </div>
          </div>
          <div className={s.stats__info__item}>
            <div className={cn(s.stats__info__item__name, 'text-gray')}>Total Staked AVS:</div>
            <div className={s.stats__info__item__value}>
              <img src={Avg} alt="" />
              <span className="text-500">630,069</span>
            </div>
          </div>
          <div className={s.stats__info__item}>
            <Tooltip
              placement="left"
              animation="zoom"
              overlay={
                <span className="text-sm">
                  10,000,000 is the total AVS available in the market.
                </span>
              }
            >
              <div className={cn(s.stats__info__item__name, 'text-gray')}>
                AVS Max Supply:
                <img src={Info} alt="" />
              </div>
            </Tooltip>
            <div className={s.stats__info__item__value}>
              <span className="text-500">10,000,000</span>
            </div>
          </div>
          <div className={s.stats__info__item}>
            <div className={cn(s.stats__info__item__name, 'text-gray')}>Contracts:</div>
            <div className={s.stats__info__item__value}>
              <img src={Eth} alt="" />
              <div className="text-gray">Ethereum</div>
              <CopyToClipboard text="0x68e0c1dbf926cda7a65ef2722e046746eb0f816f">
                <span className="cursor-pointer">
                  <span className="text-500">
                    {addressWithDots('0x68e0c1dbf926cda7a65ef2722e046746eb0f816f')}
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
                  10,000,000 is the total AVS available in the market.
                </span>
              }
            >
              <div className={cn(s.stats__info__item__name, 'text-gray')}>
                Staking APR:
                <img src={Info} alt="" />
              </div>
            </Tooltip>
            <div className={s.stats__info__item__value}>
              <span className="text-500">8%</span>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Total Deposits:</div>
          <div className={s.stats__info__item__value}>
            <img src={Usdc} alt="" />
            <span className="text-500">40,260</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Active Deposits:</div>
          <div className={s.stats__info__item__value}>
            <img src={Usdc} alt="" />
            <span className="text-500">37,194.09</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Total Interest Payout:</div>
          <div className={s.stats__info__item__value}>
            <img src={Usdc} alt="" />
            <span className="text-500">100,587.21</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Yield Pool Available:</div>
          <div className={s.stats__info__item__value}>
            <span className="text-500">3 Pools</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <Tooltip
            placement="left"
            animation="zoom"
            overlay={
              <span className="text-sm">10,000,000 is the total AVS available in the market.</span>
            }
          >
            <div className={cn(s.stats__info__item__name, 'text-gray')}>
              Lockup Period:
              <img src={Info} alt="" />
            </div>
          </Tooltip>
          <div className={s.stats__info__item__value}>
            <span className="text-500">8 - 24 weeks</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <div className={cn(s.stats__info__item__name, 'text-gray')}>Yield Source:</div>
          <div className={s.stats__info__item__value}>
            <img src={Avg} alt="" />
            <span className="text-500">AlgoVest</span>
          </div>
        </div>
        <div className={s.stats__info__item}>
          <Tooltip
            placement="left"
            animation="zoom"
            overlay={
              <span className="text-sm">10,000,000 is the total AVS available in the market.</span>
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
      </>
    );
  }, [type]);

  return (
    <div className={s.stats}>
      <div className={s.stats__overview}>
        <div className={s.stats__overview__wrapper}>
          <div className={cn(s.stats__overview__title, 'text-lg text-500')}>{content.title}</div>
          <div className={cn(s.stats__overview__title, 'text-sm text-300')}>{content.subtitle}</div>
        </div>
        <Button size="small" color="green">
          {content.btnText}
        </Button>
      </div>
      <div className={cn(s.stats__box, 'box')}>
        <div className={s.stats__info}>
          <div className={cn(s.stats__info__title, 'text-lmd text-500')}>{content.statsTitle}</div>
          {info}
        </div>
      </div>
    </div>
  );
};

export default Stats;
