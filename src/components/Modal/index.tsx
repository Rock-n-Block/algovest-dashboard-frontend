import { FC, PropsWithChildren } from 'react';

import cn from 'classnames';
import Dialog from 'rc-dialog';

import { IModalProps } from 'typings';
import { Close } from 'assets/img';

import 'rc-dialog/assets/index.css';
import s from './Modal.module.scss';

const Modal: FC<PropsWithChildren<IModalProps>> = ({
  className,
  visible,
  onClose,
  children,
  title,
  subtitle,
  steps,
}) => {
  return (
    <Dialog
      animation="zoom"
      maskAnimation="fade"
      zIndex={1000}
      destroyOnClose
      className={cn(s.modal__wrapper, className)}
      closable
      closeIcon={<img alt="" src={Close} />}
      visible={visible}
      maskClosable
      forceRender
      onClose={onClose}
    >
      {steps || null}
      {title ? <div className={cn(s.modal__title, 'text-lg text-500')}>{title}</div> : null}
      {subtitle ? (
        <div className={cn(s.modal__subtitle, 'text-smd text-gray')}>{subtitle}</div>
      ) : null}
      {children}
    </Dialog>
  );
};

export default Modal;
