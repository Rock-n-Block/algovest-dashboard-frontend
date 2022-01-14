import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';
import Tooltip from 'rc-tooltip';
import { observer } from 'mobx-react-lite';

import { Button } from 'components';
import { useMst } from 'store';
import { addressWithDots } from 'utils';

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

const nav = [
  {
    name: 'Staking',
    link: '/',
  },
  {
    name: 'Yield Pool',
    link: '/pool',
  },
];

const Header: React.VFC = () => {
  const {
    modals: { walletConnect },
    user,
  } = useMst();

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
          {nav.map((item) => (
            <NavLink
              end
              key={item.link}
              className={({ isActive }) =>
                cn(s.header__navbar__item, 'text-lmd', 'text-400', {
                  [s.header__navbar__item_active]: isActive,
                  'text-500': isActive,
                })
              }
              to={item.link}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className={s.header__wrapper}>
        {user.address ? (
          addressWithDots(user.address)
        ) : (
          <Button color="black" className={s.header__btn} onClick={walletConnect.open}>
            Connect Wallet
          </Button>
        )}
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

export default observer(Header);
