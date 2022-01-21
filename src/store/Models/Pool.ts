import { types } from 'mobx-state-tree';

const Pool = types
  .model('PoolModel', {
    activeDeposits: types.string,
    isRefresh: types.boolean,
  })
  .actions((self) => ({
    setActiveDeposits: (value: string) => {
      self.activeDeposits = value;
    },
    refreshData: (value: boolean) => {
      self.isRefresh = value;
    },
  }));

export default Pool;
