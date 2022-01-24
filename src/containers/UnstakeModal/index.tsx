import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';

import { IModalProps } from 'typings';
import { Modal, Button } from 'components';
import { useWalletConnectorContext } from 'services';
import { useMst } from 'store';

import { Avs, Info, Error } from 'assets/img';

import s from './UnstakeModal.module.scss';

interface IUnstakeModal extends Pick<IModalProps, 'onClose' | 'visible'> {
  staked: string;
  startDate: string;
  rewardsEarned: string;
}

const UnstakeModal: React.VFC<IUnstakeModal> = ({
  visible,
  onClose,
  staked,
  startDate,
  rewardsEarned,
}) => {
  const { staking, pools } = useMst();
  const { walletService } = useWalletConnectorContext();
  const [isLoading, setLoading] = React.useState(false);

  const handleClaim = React.useCallback(async () => {
    try {
      setLoading(true);
      await walletService.createTransaction({
        method: 'withdrawAvsToken',
        data: [],
        contract: 'BOND',
      });
      setLoading(false);
      staking.refreshData(true);
      onClose();
    } catch (err) {
      setLoading(false);
    }
  }, [walletService, staking, onClose]);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      className={s.us_modal}
      title="Staked AVS"
      subtitle="Your staked AVS details"
    >
      <div className={s.us_modal__content}>
        <img src={Avs} alt="" className={s.us_modal__img} />
        <div className={s.us_modal__box}>
          <div className={cn(s.us_modal__item, s.us_modal__item__gray)}>
            <div className={s.us_modal__item__el}>
              <div className={cn(s.us_modal__item__el__title, 'text-smd text-gray')}>
                Staked AVS
              </div>
              <div className={cn(s.us_modal__item__el__value, 'text-md text-600')}>{staked}</div>
            </div>
            <div className={s.us_modal__item__el}>
              <div className={cn(s.us_modal__item__el__title, 'text-smd text-gray')}>
                Start Date
              </div>
              <div className={cn(s.us_modal__item__el__value, 'text-md text-600')}>
                {format(new Date(+startDate * 1000), 'dd.MM.yyyy')}
              </div>
            </div>
          </div>
          <div className={cn(s.us_modal__item, s.us_modal__item__green)}>
            <div className={s.us_modal__item__el}>
              <div className={cn(s.us_modal__item__el__title, 'text-smd text-gray')}>
                Rewards Earned
              </div>
              <div className={cn(s.us_modal__item__el__value, 'text-md text-600')}>
                {rewardsEarned}
              </div>
            </div>
          </div>
        </div>
        <Button
          className={s.us_modal__btn}
          color="green"
          loading={isLoading}
          onClick={handleClaim}
          disabled={pools.activeBonds > 0}
        >
          Claim Reward
        </Button>
        {pools.activeBonds > 0 ? (
          <div className={s.us_modal__info}>
            <img src={Error} alt="" />
            <span className="text-sm text-red">Cant withdraw you have an active bond</span>
          </div>
        ) : null}
        <div className={s.us_modal__info}>
          <img src={Info} alt="" />
          <span className="text-sm text-gray">
            You earn more rewards when your stake exceeds 60 days{' '}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default observer(UnstakeModal);
