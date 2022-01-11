import { VFC } from 'react';

import { Button } from 'components/index';

import { Logo } from 'assets/img/index';

import './Home.scss';

const Home: VFC = () => {
  return (
    <div className="home">
      <img src={Logo} alt="logo" style={{ width: '500px' }} />
      <Button>Button</Button>
    </div>
  );
};

export default Home;
