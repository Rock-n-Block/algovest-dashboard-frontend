import React from 'react';
import cn from 'classnames';
import { format, add, differenceInDays, differenceInWeeks, differenceInSeconds } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { IModalProps } from 'typings';
import { Modal, Button } from 'components';
import { TBondItem } from 'store/Models/Pools';
import { WalletService, useWalletConnectorContext } from 'services';
import { useMst } from 'store';

import { Avs, Usdc, Interest, Info } from 'assets/img';

import s from './ClaimModal.module.scss';
import BigNumber from 'bignumber.js';

interface IClaimModal extends Pick<IModalProps, 'onClose' | 'visible'> {
  deposit?: TBondItem;
}

const ClaimModal: React.VFC<IClaimModal> = ({ visible, onClose, deposit }) => {
  const { walletService } = useWalletConnectorContext();
  const { pools } = useMst();
  const [loading, setLoading] = React.useState(false);

  console.log(deposit, 'deposit');

  const handleClaim = React.useCallback(async () => {
    try {
      if (deposit) {
        setLoading(true);
        await walletService.createTransaction({
          method: 'claimInterest',
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

  const pendingInterest = React.useMemo(() => {
    if (+daysBeforeClaim <= 0 && deposit) {
      // let diff = differenceInMinutes(new Date(), new Date(+deposit.depositTimestamp * 1000));
      let diff = differenceInWeeks(new Date(), new Date(+deposit.depositTimestamp * 1000));
      if (diff > +deposit.pool.noncesToUnlock) {
        diff = +deposit.pool.noncesToUnlock;
      }
      const pendingInt = WalletService.weiToEthWithDecimals(deposit.pendingInterest);
      const interest = new BigNumber(pendingInt)
        .div(deposit.pool.noncesToUnlock)
        .multipliedBy(diff - +deposit.currentNonce);
      return interest.toFixed(3, 1);
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysBeforeClaim, deposit, visible]);

  if (!deposit) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      className={s.c_modal}
      title="Yield Pool"
      subtitle="Your deposited USDC details"
    >
      <div className={s.c_modal__content}>
        <img src={Usdc} alt="" className={cn(s.c_modal__img, s.c_modal__img__usdc)} />
        <img src={Avs} alt="" className={cn(s.c_modal__img, s.c_modal__img__avs)} />
        <div className={s.c_modal__box}>
          <div className={s.c_modal__item}>
            <div className={cn(s.c_modal__item__title, 'text-smd')}>Date:</div>
            <div className={cn(s.c_modal__item__value, 'text-smd text-600')}>
              {format(new Date(+deposit.depositTimestamp * 1000), 'dd.MM.yyyy')}
            </div>
          </div>
          <div className={s.c_modal__item}>
            <div className={cn(s.c_modal__item__title, 'text-smd')}>Amount:</div>
            <div className={cn(s.c_modal__item__value, 'text-smd text-600')}>
              {WalletService.weiToEthWithDecimals(deposit.amount)}
            </div>
          </div>
          <div className={s.c_modal__item}>
            <div className={cn(s.c_modal__item__title, 'text-smd')}>Period:</div>
            <div className={cn(s.c_modal__item__value, 'text-smd text-600')}>
              {deposit.pool.noncesToUnlock} Weeks
            </div>
          </div>
          <div className={s.c_modal__item}>
            <div className={cn(s.c_modal__item__title, 'text-smd')}>Coin:</div>
            <div className={cn(s.c_modal__item__value, 'text-smd text-600')}>USDC</div>
          </div>
          <div className={s.c_modal__item}>
            <div className={cn(s.c_modal__item__title, 'text-smd')}>Est. APR:</div>
            <div className={cn(s.c_modal__item__value, 'text-smd text-600')}>
              {deposit.pool.periodInterestRate}%
            </div>
          </div>
          <div className={s.c_modal__item}>
            <div className={cn(s.c_modal__item__title, 'text-smd')}>Total Interest:</div>
            <div className={cn(s.c_modal__item__value, 'text-smd text-600')}>
              {WalletService.weiToEthWithDecimals(deposit.pendingInterest)}
            </div>
          </div>
        </div>
        {pendingInterest ? (
          <div className={s.c_modal__interest}>
            <img src={Interest} alt="" />
            <span className="text-smd">Unclaimed Interest:</span>
            <span className="text-600 text-smd">{pendingInterest}</span>
          </div>
        ) : null}
        {daysBeforeClaim > 0 ? (
          <>
            <Button disabled className={s.c_modal__btn}>
              Claim Reward: {daysBeforeClaim} days left
            </Button>
            <div className={s.c_modal__info}>
              <img src={Info} alt="" />
              <span className="text-gray text-sm">
                You can earn more interest when deposit exceeds the wait period{' '}
              </span>
            </div>
          </>
        ) : (
          <Button color="green" className={s.c_modal__btn} onClick={handleClaim} loading={loading}>
            Claim
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default observer(ClaimModal);
