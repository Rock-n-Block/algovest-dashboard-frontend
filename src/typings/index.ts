import React from 'react';

export interface IModalProps {
  className?: string;
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  steps?: React.ReactElement;
}

export type TNullable<T> = T | null;
export type TOptionable<T> = T | undefined;

export * from './connect';
