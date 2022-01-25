import { CSSProperties, FC, PropsWithChildren, RefObject, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

import cn from 'classnames';

import s from './Button.module.scss';

export interface IButton {
  color?: 'green' | 'gray' | 'disabled' | 'black' | 'gray-light' | 'black-outlined';
  padding?: 'default' | string;
  active?: boolean;
  size?: 'default' | 'medium' | 'small' | 'big';
  isFullWidth?: boolean;
  className?: string;
  onClick?: (event: any) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: string;
  onMouseLeave?: (event: any) => void;
  onMouseOver?: (event: SyntheticEvent) => void;
  style?: CSSProperties;
  href?: string;
  btnRef?: RefObject<HTMLButtonElement>;
  loading?: boolean;
  rounded?: boolean;
}

/**
 *
 * @param {'default' | 'custom'} [tag] - padding of the element {large}
 * custom values:
 * example: [value][units] = 10px
 * * 10px
 * * 10px 10px
 * * 10px 10px 10px
 * * 10px 10px 10px 10px
 * @param {CSSProperties}  [style] - inline styles {}
 * @param {any} [size] - font size of text {normal}
 * @param {Color} [color] - color of button {filled}
 * @param {boolean} [isFullWidth] - set the with of the element 100% {false}
 * @param {(event: any) => void} [onClick] - the callback which will be called after element has been clicked {() => { }}
 * @param {'button' | 'submit'} [type] - type of button {'button'}
 * @param {boolean} [disabled] - set parameter disabled to the button {undefined}
 * @param {string} [icon] - the src of the icon {undefined}
 * @param {(event: any) => void} [onMouseLeave] - the callback which be called after the cursor leaves the button {undefined}
 * @param {(event: SyntheticEvent) => void} [onMouseOver] - the callback which be called after the cursor is on the button {undefined}
 * @param {string} [href] - href of the a
 * @returns Text component
 */

const Button: FC<PropsWithChildren<IButton>> = ({
  color = 'gray',
  size = 'default',
  isFullWidth = false,
  onClick = () => {},
  className,
  type = 'button',
  children,
  padding = 'default',
  disabled,
  icon,
  style,
  href,
  btnRef,
  onMouseLeave,
  onMouseOver = () => {},
  active,
  loading,
  rounded,
}) => {
  if (href)
    return (
      <Link
        to={href}
        className={cn(
          s.button,
          s[size],
          s[color],
          s[`${padding.includes('default') ? padding : ''}`],
          className,
          {
            [s.isFullWidth]: isFullWidth,
            [s.disabled]: disabled || color === 'disabled',
          },
        )}
        style={!padding.includes('default') ? { ...style, padding } : style}
      >
        {icon && <img src={icon} className={s.icon} alt="" />}
        {children}
      </Link>
    );
  return (
    <button
      ref={btnRef}
      type={type === 'submit' ? 'submit' : 'button'}
      className={cn(
        s.button,
        s[size],
        s[color],
        s[`${padding.includes('default') ? padding : ''}`],
        className,
        {
          [s.isFullWidth]: isFullWidth,
          [s.disabled]: disabled || color === 'disabled' || loading,
          [s.active]: active,
          [s.rounded]: rounded,
        },
      )}
      onClick={onClick}
      disabled={disabled || loading}
      style={!padding.includes('default') ? { ...style, padding } : style}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseOver}
    >
      {icon && <img src={icon} className={s.icon} alt="" />}
      {loading ? 'In progress...' : <span>{children}</span>}
    </button>
  );
};

export default Button;
