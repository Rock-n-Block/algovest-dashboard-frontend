import { types, SnapshotOut, cast } from 'mobx-state-tree';

const PoolItem = types.model('PoolItem', {
  id: types.union(types.number, types.string),
  locked: types.boolean,
  minDeposit: types.string,
  noncesToUnlock: types.string,
  periodInterestRate: types.string,
});

export type IPoolItem = SnapshotOut<typeof PoolItem>;

const Pools = types
  .model('PoolsModel', {
    activeDeposits: types.string,
    items: types.array(PoolItem),
    isRefresh: types.boolean,
  })
  .actions((self) => ({
    setActiveDeposits: (value: string) => {
      self.activeDeposits = value;
    },
    setPools: (items: IPoolItem[]) => {
      self.items = cast(items);
    },
    refreshData: (value: boolean) => {
      self.isRefresh = value;
    },
  }));

export default Pools;
