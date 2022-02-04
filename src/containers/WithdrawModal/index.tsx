import React from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { TBondItem } from 'store/Models/Pools';

import cn from 'classnames';
import { add, addWeeks, differenceInDays, differenceInSeconds, format } from 'date-fns';
import { IModalProps } from 'typings';

import { Button, Modal } from 'components';

import { useWalletConnectorContext, WalletService } from 'services';

import { Avs, Info, Usdc } from 'assets/img';

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
      const nextClaim = add(new Date(+deposit.depositTimestamp * 1000), {
        weeks: +deposit.currentNonce + 1,
      });
      const diffDays = differenceInDays(new Date(nextClaim), new Date());
      const diffSeconds = differenceInSeconds(new Date(nextClaim), new Date());
      if (diffDays < 1 && diffSeconds > 0) {
        return diffDays + 1;
      }
      return diffDays;
      // return differenceInDays(new Date(nextClaim), new Date());
    }
    return 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit, visible]);

  const unlockDate = React.useMemo(() => {
    if (deposit) {
      const unlock = addWeeks(
        new Date(+deposit.depositTimestamp * 1000),
        +deposit.pool.noncesToUnlock,
      );

      return format(unlock, 'dd.MM.yyyy');
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deposit, visible]);

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
              {WalletService.weiToEthWithDecimals(deposit.amount, 6)}
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
