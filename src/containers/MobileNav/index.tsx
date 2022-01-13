import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

import s from './MobileNav.module.scss';

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
const MobileNav: React.VFC = () => {
  return (
    <div className={s.mob_nav}>
      {nav.map((item) => (
        <NavLink
          end
          key={item.link}
          className={({ isActive }) =>
            cn(s.mob_nav__item, 'text-smd', 'text-400', {
              [s.mob_nav__item_active]: isActive,
              'text-500': isActive,
            })
          }
          to={item.link}
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
