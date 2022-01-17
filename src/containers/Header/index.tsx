import React from 'react';
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

const Header: React.VFC = () => {
  const {
    modals: { walletConnect },
    user,
  } = useMst();

  const [isTooltipVisible, setTooltipVisible] = React.useState(false);

  const handleChangeTooltipVisible = React.useCallback((visible) => {
    setTooltipVisible(visible);
  }, []);

  const handleCloseTooltipOnScroll = React.useCallback(() => {
    handleChangeTooltipVisible(false);
  }, [handleChangeTooltipVisible]);

  React.useEffect(() => {
    if (isTooltipVisible) {
      window.addEventListener('scroll', handleCloseTooltipOnScroll);
    } else {
      window.removeEventListener('scroll', handleCloseTooltipOnScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleCloseTooltipOnScroll);
    };
  }, [handleCloseTooltipOnScroll, isTooltipVisible]);

  return (
    <header className={s.header}>
      <div className={s.header__wrapper}>
        <div className={s.header__logo}>
          <img src={Logo} alt="" />
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
