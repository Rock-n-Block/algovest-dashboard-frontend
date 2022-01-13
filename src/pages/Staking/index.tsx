import { VFC } from 'react';

import { Stats, Transactions } from 'containers';

const Staking: VFC = () => {
  return (
    <div className="Staking">
      <div className="container">
        <Stats type="staking" />
        <Transactions />
      </div>
    </div>
  );
};

export default Staking;
