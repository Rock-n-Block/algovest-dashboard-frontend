import React, { useCallback, useEffect } from 'react';

// import Pagination from 'rc-pagination';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { TBondItem } from 'store/Models/Pools';

import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';
import { ClaimModal, WithdrawModal } from 'containers';
import { format } from 'date-fns';
import Tooltip from 'rc-tooltip';
import { TOptionable } from 'typings';

import { Button } from 'components';
import { numbWithCommas } from 'utils';

import { useModal, useWindowSize } from 'hooks';
import { useWalletConnectorContext, WalletService } from 'services';

import { ReactComponent as Dots } from 'assets/img/icons/dots.svg';

import s from './TableTrx.module.scss';

const PoolTrx: React.VFC = () => {
  const { pools } = useMst();
  const { walletService } = useWalletConnectorContext();
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

  const handleGetClaimValue = useCallback(
    async (depositId: number) => {
      try {
        const claimInterest = await walletService.createTransaction({
          method: 'claimInterest',
          data: [depositId],
          contract: 'BOND',
        });
        return claimInterest;
      } catch (error) {
        return '';
      }
    },
    [walletService],
  );

  useEffect(() => {
    handleGetClaimValue(1);
  }, [handleGetClaimValue]);

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
                {numbWithCommas(WalletService.weiToEthWithDecimals(deposit.amount, 6))}
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
                {new BigNumber(WalletService.weiToEthWithDecimals(deposit.amount, 6))
                  .multipliedBy(new BigNumber(deposit.pool.periodInterestRate).dividedBy(100))
                  .dividedBy(365)
                  .multipliedBy(7)
                  .multipliedBy(deposit.pool.noncesToUnlock)
                  .toFixed(2, 1)}
                {/* {deposit.pendingInterest} */}
                {/* {numbWithCommas(WalletService.weiToEthWithDecimals(deposit.pendingInterest, 6))} */}
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
