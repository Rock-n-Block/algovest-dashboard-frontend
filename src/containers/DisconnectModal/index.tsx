import React from 'react';
import { observer } from 'mobx-react-lite';

import { IModalProps } from 'typings';
import { Modal, Button } from 'components';
import { useMst } from 'store';
import { useWalletConnectorContext } from 'services';

import s from './DisconnectModal.module.scss';

const DisconnectModal: React.VFC<Pick<IModalProps, 'onClose' | 'visible'>> = ({
  onClose,
  visible,
}) => {
  const { user } = useMst();
  const { disconnect } = useWalletConnectorContext();

  const handleDisconnect = React.useCallback(() => {
    onClose();
    disconnect();
  }, [disconnect, onClose]);

  return (
    <Modal visible={visible} onClose={onClose} className={s.dis_modal} title="Disconnect account">
      <div className={s.dis_modal__content}>
        <div className="text-lmd text-ellipsis">{user.address}</div>
        <Button color="green" onClick={handleDisconnect} className={s.dis_modal__btn}>
          Disconnect
        </Button>
      </div>
    </Modal>
  );
};

export default observer(DisconnectModal);
