import React from 'react';
import cn from 'classnames';
// import Pagination from 'rc-pagination';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import Tooltip from 'rc-tooltip';

import { useMst } from 'store';
import { WalletService } from 'services';
import { ClaimModal, WithdrawModal } from 'containers';
import { useModal, useWindowSize } from 'hooks';
import { TBondItem } from 'store/Models/Pools';
import { TOptionable } from 'typings';
import { Button } from 'components';
import { numbWithCommas } from 'utils';

import s from './TableTrx.module.scss';

import { ReactComponent as Dots } from 'assets/img/icons/dots.svg';

const PoolTrx: React.VFC = () => {
  const { pools } = useMst();
  const [isClaimModalVisible, handleOpenClaimModal, handleCloseClaimModal] = useModal(false);
  const [isWithdrawModalVisible, handleOpenWithdrawModal, handleCloseWithdrawModal] =
    useModal(false);
  const [selectedDeposit, setDeposit] = React.useState<TOptionable<TBondItem>>();
  const { width } = useWindowSize();

  // const buttonItemRender = (_: number, type: string, element: React.ReactNode) => {
  //   if (type === 'prev') {
  //     return (
  //       <div className={cn(s.t_table__nav, s.t_table__nav_prev)}>
  //         <img src={ArrowNav} alt="" />
  //         <span className="text-smd">Previous</span>
  //       </div>
  //     );
  //   }
  //   if (type === 'next') {
  //     return (
  //       <div className={cn(s.t_table__nav, s.t_table__nav_next)}>
  //         <span className="text-smd">Next</span>
  //         <img src={ArrowNav} alt="" />
  //       </div>
  //     );
  //   }
  //   return element;
  // };

  const handleSelectDeposit = React.useCallback(
    (deposit: TBondItem, type: 'claim' | 'withdraw') => {
      setDeposit(deposit);
      if (type === 'claim') {
        handleOpenClaimModal();
      } else {
        handleOpenWithdrawModal();
      }
    },
    [handleOpenClaimModal, handleOpenWithdrawModal],
  );

  return (
    <>
      <div className={s.t_table}>
        <div className={cn(s.t_table__head, s.t_table__pool__row, s.t_table__row)}>
          <div className={s.t_table__head__item}>
            {/* <div className={s.t_table__head__item__controll}>
              <span>Date</span>
              <img src={ArrowSort} alt="" />
            </div> */}
            <span>Date</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Coin</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Amount</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Est. APR</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Period</span>
          </div>
          <div className={s.t_table__head__item}>
            <span>Total Interest</span>
          </div>
          <div className="" />
        </div>
        {pools.deposits.map((deposit) => (
          <div
            key={deposit.depositTimestamp}
            className={cn(s.t_table__pool__row, s.t_table__row, 'text-md')}
          >
            <div className={s.t_table__pool__row__data}>
              <div className={s.t_table__pool__row__name}>Date</div>
              <div className={s.t_table__pool__row__value}>
                {format(new Date(+deposit.depositTimestamp * 1000), 'dd.MM.yyyy')}
              </div>
            </div>
            <div className={s.t_table__pool__row__data}>
              <div className={s.t_table__pool__row__name}>Coin</div>
              <div className={s.t_table__pool__row__value}>USDC</div>
            </div>
            <div className={s.t_table__pool__row__data}>
              <div className={s.t_table__pool__row__name}>Amount</div>
              <div className={s.t_table__pool__row__value}>
                {numbWithCommas(WalletService.weiToEthWithDecimals(deposit.amount))}
              </div>
            </div>
            <div className={s.t_table__pool__row__data}>
              <div className={s.t_table__pool__row__name}>Est. APR</div>
              <div className={s.t_table__pool__row__value}>{deposit.pool.periodInterestRate}%</div>
            </div>
            <div className={s.t_table__pool__row__data}>
              <div className={s.t_table__pool__row__name}>Period</div>
              <div className={s.t_table__pool__row__value}>{deposit.pool.noncesToUnlock} Weeks</div>
            </div>
            <div className={s.t_table__pool__row__data}>
              <div className={s.t_table__pool__row__name}>Total Interest</div>
              <div className={s.t_table__pool__row__value}>
                {numbWithCommas(WalletService.weiToEthWithDecimals(deposit.pendingInterest))}
              </div>
            </div>
            {width > 1000 ? (
              <Tooltip
                animation="zoom"
                placement="bottomLeft"
                overlayClassName="header-tooltip"
                trigger="click"
                overlay={
                  <>
                    {deposit.currentNonce < deposit.pool.noncesToUnlock ? (
                      <Button
                        onClick={() => handleSelectDeposit(deposit, 'claim')}
                        size="small"
                        color="black-outlined"
                        className={s.t_table__pool__row__btn}
                      >
                        Claim
                      </Button>
                    ) : (
                      <Button
                        disabled
                        size="small"
                        color="black-outlined"
                        className={s.t_table__pool__row__btn}
                      >
                        Claimed
                      </Button>
                    )}
                    {!deposit.withdrawn ? (
                      <Button
                        size="small"
                        className={s.t_table__pool__row__btn}
                        color="black-outlined"
                        onClick={() => handleSelectDeposit(deposit, 'withdraw')}
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <Button
                        disabled
                        size="small"
                        color="black-outlined"
                        className={s.t_table__pool__row__btn}
                      >
                        Withdrawed
                      </Button>
                    )}
                  </>
                }
              >
                <Button className={s.header__btn} color="gray-light" rounded size="small">
                  <Dots />
                </Button>
              </Tooltip>
            ) : (
              <div className={s.t_table__pool__btns}>
                {deposit.currentNonce < deposit.pool.noncesToUnlock ? (
                  <Button
                    onClick={() => handleSelectDeposit(deposit, 'claim')}
                    size="small"
                    color="black-outlined"
                    className={s.t_table__pool__row__btn}
                  >
                    Claim
                  </Button>
                ) : (
                  <Button
                    disabled
                    size="small"
                    color="black-outlined"
                    className={s.t_table__pool__row__btn}
                  >
                    Claimed
                  </Button>
                )}
                {!deposit.withdrawn ? (
                  <Button
                    size="small"
                    className={s.t_table__pool__row__btn}
                    color="black-outlined"
                    onClick={() => handleSelectDeposit(deposit, 'withdraw')}
                  >
                    Withdraw
                  </Button>
                ) : (
                  <Button
                    disabled
                    size="small"
                    color="black-outlined"
                    className={s.t_table__pool__row__btn}
                  >
                    Withdrawed
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
        {/* <Pagination simple defaultCurrent={1} total={50} itemRender={buttonItemRender} /> */}
      </div>
      <ClaimModal
        visible={isClaimModalVisible}
        onClose={handleCloseClaimModal}
        deposit={selectedDeposit}
      />
      <WithdrawModal
        visible={isWithdrawModalVisible}
        onClose={handleCloseWithdrawModal}
        deposit={selectedDeposit}
      />
    </>
  );
};

export default observer(PoolTrx);
