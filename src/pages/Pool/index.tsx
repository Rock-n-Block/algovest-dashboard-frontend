import { VFC } from 'react';

import { Stats, Transactions } from 'containers';

const Pool: VFC = () => {
  return (
    <div className="pool">
      <div className="container">
        <Stats type="pool" />
        <Transactions type="pool" />
      </div>
    </div>
  );
};

export default Pool;
