export interface IModalProps {
  className?: string;
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export type TNullable<T> = T | null;
export type TOptionable<T> = T | undefined;
