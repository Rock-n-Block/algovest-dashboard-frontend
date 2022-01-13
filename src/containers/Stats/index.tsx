import React from 'react';
import cn from 'classnames';
import Tooltip from 'rc-tooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Button } from 'components';
import { addressWithDots } from 'utils';
import { StakeModal, DepositModal } from 'containers';
import { useModal } from 'hooks';

import s from './Stats.module.scss';

import { ArrowGreen, Avs, Info, Eth, Copy, Usdc, Lock } from 'assets/img';

interface IStats {
  type: 'staking' | 'pool';
}

const Stats: React.VFC<IStats> = ({ type }) => {
  const [isStakeVisible, handleOpenStake, handleCloseStake] = useModal();
  const [isDepositVisible, handleOpenDeposit, handleCloseDeposit] = useModal();

  const handleOpenModal = React.useCallback(() => {
    if (type === 'staking') {
      handleOpenStake();
    } else {
      handleOpenDeposit();
    }
  }, [type, handleOpenStake, handleOpenDeposit]);

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
        <div className={s.stats__info__box}>
          <div className={s.stats__info__item}>
            <div className={cn(s.stats__info__item__name, 'text-gray')}>No. of AVS Stakers:</div>
            <div className={s.stats__info__item__value}>
              <img src={ArrowGreen} alt="" />
              <div className="text-green">4.43%</div>
              <span className="text-500">14,302</span>
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
        </div>
      );
    }
    return (
      <div className={s.stats__info__box}>
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
            <img src={Avs} alt="" />
            <span className="text-500 text-gray">AlgoVest</span>
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
      </div>
    );
  }, [type]);

  const total = React.useMemo(() => {
    if (type === 'staking') {
      return (
        <>
          <div className={s.stats__total}>
            <div className={s.stats__total__img}>
              <img src={Avs} alt="" />
            </div>
            <div className={cn(s.stats__total__amount, 'text-bold')}>200.504</div>
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
          <div className={cn(s.stats__total__amount, 'text-bold')}>200.504</div>
          <div className={cn(s.stats__total__text, 'text-gray text-md')}>Total Value Locked</div>
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
        <Button size="small" color="green" onClick={handleOpenModal} className={s.stats__btn}>
          {content.btnText}
        </Button>
      </div>
      <div className="box">
        <div className={cn(s.stats__info__title, 'text-lmd text-500')}>{content.statsTitle}</div>
        <div className={s.stats__box}>
          <div className={s.stats__info}>{info}</div>
          <div className={s.stats__total}>{total}</div>
        </div>
      </div>
      <StakeModal visible={isStakeVisible} onClose={handleCloseStake} />
      <DepositModal visible={isDepositVisible} onClose={handleCloseDeposit} />
    </div>
  );
};

export default Stats;
