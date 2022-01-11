import { VFC } from 'react';

import { Stats } from 'containers';

const Pool: VFC = () => {
  return (
    <div className="pool">
      <div className="container">
        <Stats type="pool" />
      </div>
    </div>
  );
};

export default Pool;
