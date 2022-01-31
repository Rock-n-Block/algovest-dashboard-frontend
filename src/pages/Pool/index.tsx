import { VFC } from 'react';

import { Deposit, Stats, Transactions } from 'containers';

const Pool: VFC = () => {
  return (
    <div className="pool">
      <div className="container">
        <Stats type="pool" />
        <Deposit />
        <Transactions type="pool" />
      </div>
    </div>
  );
};

export default Pool;
