import { types } from 'mobx-state-tree';

const Pools = types
  .model('PoolsModel', {
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

export default Pools;
