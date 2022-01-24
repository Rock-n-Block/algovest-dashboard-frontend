import { VFC } from 'react';

import { Stats, Transactions, Deposit } from 'containers';

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
