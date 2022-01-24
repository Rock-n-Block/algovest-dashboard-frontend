import { VFC } from 'react';

import { Stats, Stake, Transactions } from 'containers';

const Staking: VFC = () => {
  return (
    <div className="Staking">
      <div className="container">
        <Stats type="staking" />
        <Stake />
        <Transactions type="staking" />
      </div>
    </div>
  );
};

export default Staking;
