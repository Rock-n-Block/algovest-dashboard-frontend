import { VFC } from 'react';

import { Stats } from 'containers';

const Staking: VFC = () => {
  return (
    <div className="Staking">
      <div className="container">
        <Stats type="staking" />
      </div>
    </div>
  );
};

export default Staking;
