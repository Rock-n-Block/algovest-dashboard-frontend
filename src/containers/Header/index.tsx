import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import Tooltip from 'rc-tooltip';

import { Button } from 'components';

import { Logo, Dots, Arrow } from 'assets/img';

import s from './Header.module.scss';

const links = [
  {
    name: 'About',
    link: '/',
  },
  {
    name: 'Docs',
    link: '/',
  },
  {
    name: 'Telegram',
    link: '/',
  },
];

const Header: React.VFC = () => {
  const [isTooltipVisible, setTooltipVisible] = React.useState(false);

  const handleChangeTooltipVisible = React.useCallback((visible) => {
    setTooltipVisible(visible);
  }, []);

  return (
    <header className={s.header}>
      <div className={s.header__wrapper}>
        <div className={s.header__logo}>
          <img src={Logo} alt="" />
        </div>
        <div className={s.header__navbar}>
          <NavLink
            end
            className={({ isActive }) =>
              cn(s.header__navbar__item, 'text-lmd', 'text-400', {
                [s.header__navbar__item_active]: isActive,
                'text-500': isActive,
              })
            }
            to="/"
          >
            Staking
          </NavLink>
          <NavLink
            end
            className={({ isActive }) =>
              cn(s.header__navbar__item, 'text-lmd', 'text-400', {
                [s.header__navbar__item_active]: isActive,
                'text-500': isActive,
              })
            }
            to="pool"
          >
            Yield Pool
          </NavLink>
        </div>
      </div>
      <div className={s.header__wrapper}>
        <Button color="black" className={s.header__btn}>
          Connect Wallet
        </Button>
        <Tooltip
          visible={isTooltipVisible}
          animation="zoom"
          overlayClassName="header-tooltip"
          onVisibleChange={handleChangeTooltipVisible}
          trigger="click"
          overlay={links.map((item) => (
            <a
              href={item.link}
              key={item.name}
              className={s.header__link}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-md">{item.name}</span>
              <img src={Arrow} alt="" />
            </a>
          ))}
          placement="bottomRight"
        >
          <Button className={s.header__btn} color="gray-light" rounded>
            <img src={Dots} alt="" />
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
