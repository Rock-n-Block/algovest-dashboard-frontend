import { VFC } from 'react';

import { Stats, Stake } from 'containers';

const Staking: VFC = () => {
  return (
    <div className="Staking">
      <div className="container">
        <Stats type="staking" />
        <Stake />
      </div>
    </div>
  );
};

export default Staking;
