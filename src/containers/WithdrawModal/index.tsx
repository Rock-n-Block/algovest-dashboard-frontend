import React from 'react';
import cn from 'classnames';
import { format, add, differenceInMinutes, differenceInSeconds, addMinutes } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { IModalProps } from 'typings';
import { Modal, Button } from 'components';
import { TBondItem } from 'store/Models/Pools';
import { WalletService, useWalletConnectorContext } from 'services';
import { useMst } from 'store';

import { Avs, Usdc, Info } from 'assets/img';

import s from './WithdrawModal.module.scss';

interface IWithdrawModal extends Pick<IModalProps, 'onClose' | 'visible'> {
  deposit?: TBondItem;
}

const WithdrawModal: React.VFC<IWithdrawModal> = ({ visible, onClose, deposit }) => {
  const { walletService } = useWalletConnectorContext();
  const { pools } = useMst();
  const [loading, setLoading] = React.useState(false);

  const handleWithdraw = React.useCallback(async () => {
    try {
      if (deposit) {
        setLoading(true);
        await walletService.createTransaction({
          method: 'withdrawPrinciple',
          data: [deposit.id],
          contract: 'BOND',
        });
        setLoading(false);
        pools.refreshData(true);
        onClose();
      }
    } catch (err) {
      setLoading(false);
    }
  }, [walletService, onClose, deposit, pools]);

  const daysBeforeClaim = React.useMemo(() => {
    if (deposit) {
      // const nextClaim = add(new Date(+deposit.depositTimestamp * 1000), {
      //   weeks: +deposit.pool.noncesToUnlock
      // });
      const nextClaim = add(new Date(+deposit.depositTimestamp * 1000), {
        minutes: +deposit.pool.noncesToUnlock + 1 * 5,
      });
      const diffWeeks = differenceInMinutes(new Date(nextClaim), new Date());
      const diffSeconds = differenceInSeconds(new Date(nextClaim), new Date());
      if (diffSeconds > 0) {
        return diffWeeks + 1;
      }
      return diffWeeks;
      // return differenceInDays(new Date(nextClaim), new Date());
    }
    return 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit, visible]);

  const unlockDate = React.useMemo(() => {
    if (deposit) {
      // const unlock = addWeeks(
      //   new Date(+deposit.depositTimestamp * 1000),
      //   +deposit.pool.noncesToUnlock,
      // );
      const unlock = addMinutes(
        new Date(+deposit.depositTimestamp * 1000),
        +deposit.pool.noncesToUnlock * 5,
      );

      return format(unlock, 'dd.MM.yyyy');
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit, visible]);

  // const pendingInterest = React.useMemo(() => {
  //   if (+daysBeforeClaim <= 0 && deposit) {
  //     let diff = differenceInMinutes(new Date(), new Date(+deposit.depositTimestamp * 1000));
  //     // const diff = differenceInWeeks(new Date(), new Date(+deposit.depositTimestamp * 1000));
  //     diff = Math.ceil(diff / 5);
  //     if (diff > +deposit.pool.noncesToUnlock) {
  //       diff = +deposit.pool.noncesToUnlock;
  //     }
  //     const pendingInt = WalletService.weiToEthWithDecimals(deposit.pendingInterest);
  //     const interest = new BigNumber(pendingInt)
  //       .div(deposit.pool.noncesToUnlock)
  //       .multipliedBy(diff - +deposit.currentNonce);
  //     return interest.toFixed(3, 1);
  //   }
  //   return '';
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [daysBeforeClaim, deposit, visible]);

  if (!deposit) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      className={s.w_modal}
      title="Withdraw Deposit"
      subtitle="Your deposited USDC details"
    >
      <div className={s.w_modal__content}>
        <img src={Usdc} alt="" className={cn(s.w_modal__img, s.w_modal__img__usdc)} />
        <img src={Avs} alt="" className={cn(s.w_modal__img, s.w_modal__img__avs)} />
        <div className={s.w_modal__box}>
          <div className={s.w_modal__item}>
            <div className={cn(s.w_modal__item__title, 'text-smd')}>Date deposited:</div>
            <div className={cn(s.w_modal__item__value, 'text-smd text-600')}>
              {format(new Date(+deposit.depositTimestamp * 1000), 'dd.MM.yyyy')}
            </div>
          </div>
          <div className={s.w_modal__item}>
            <div className={cn(s.w_modal__item__title, 'text-smd')}>Total USDC: </div>
            <div className={cn(s.w_modal__item__value, 'text-smd text-600')}>
              {WalletService.weiToEthWithDecimals(deposit.amount)}
            </div>
          </div>
          <div className={s.w_modal__item}>
            <div className={cn(s.w_modal__item__title, 'text-smd')}>Unlock date:</div>
            <div className={cn(s.w_modal__item__value, 'text-smd text-600')}>{unlockDate}</div>
          </div>
        </div>
        {daysBeforeClaim > 0 ? (
          <>
            <Button disabled className={s.w_modal__btn}>
              Withdraw: {daysBeforeClaim} days left to unlock
            </Button>
            <div className={s.w_modal__info}>
              <img src={Info} alt="" />
              <span className="text-gray text-sm">
                You can earn more interest when deposit exceeds the wait period{' '}
              </span>
            </div>
          </>
        ) : (
          <>
            {deposit.currentNonce !== deposit.pool.noncesToUnlock ? (
              <Button disabled className={s.w_modal__btn}>
                Please claim first before withdrawing
              </Button>
            ) : (
              <Button
                color="green"
                className={s.w_modal__btn}
                onClick={handleWithdraw}
                loading={loading}
              >
                Withdraw
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default observer(WithdrawModal);
