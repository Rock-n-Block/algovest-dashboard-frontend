import React from 'react';
import { NavLink } from 'react-router-dom';

import cn from 'classnames';

import s from './Navbar.module.scss';

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
const Navbar: React.VFC = () => {
  return (
    <div className={s.navbar}>
      {nav.map((item) => (
        <NavLink
          end
          key={item.link}
          className={({ isActive }) =>
            cn(s.navbar__item, 'text-smd', 'text-400', {
              [s.navbar__item_active]: isActive,
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

export default Navbar;
