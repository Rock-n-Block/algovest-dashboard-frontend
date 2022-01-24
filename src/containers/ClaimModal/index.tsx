import React from 'react';
import cn from 'classnames';
import { format, add, differenceInMinutes } from 'date-fns';
import { observer } from 'mobx-react-lite';

import { IModalProps } from 'typings';
import { Modal, Button } from 'components';
import { TBondItem } from 'store/Models/Pools';
import { WalletService, useWalletConnectorContext } from 'services';
import { useMst } from 'store';

import { Avs, Usdc, Interest, Info } from 'assets/img';

import s from './ClaimModal.module.scss';

interface IClaimModal extends Pick<IModalProps, 'onClose' | 'visible'> {
  deposit?: TBondItem;
}

const ClaimModal: React.VFC<IClaimModal> = ({ visible, onClose, deposit }) => {
  const { walletService } = useWalletConnectorContext();
  const { pools } = useMst();
  const [loading, setLoading] = React.useState(false);

  const daysBeforeClaim = React.useMemo(() => {
    if (deposit) {
      // const nextClaim = add(new Date(+deposit.depositTimestamp * 1000), {
      //   weeks: +deposit.currentNonce + 1,
      // });
      const nextClaim = add(new Date(+deposit.depositTimestamp * 1000), {
        minutes: (+deposit.currentNonce + 1) * 5,
      });
      return differenceInMinutes(new Date(nextClaim), new Date());
    }
    return 0;
  }, [deposit]);
  console.log(daysBeforeClaim, 'daysBeforeClaim');

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
        <div className={s.c_modal__interest}>
          <img src={Interest} alt="" />
          <span className="text-smd">Unclaimed Interest:</span>
          <span className="text-600 text-smd">5,000.00</span>
        </div>
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
