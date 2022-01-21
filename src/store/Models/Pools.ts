import { types, SnapshotOut, cast } from 'mobx-state-tree';

const PoolItem = types.model('PoolItem', {
  id: types.identifierNumber,
  locked: types.boolean,
  minDeposit: types.string,
  noncesToUnlock: types.string,
  periodInterestRate: types.string,
});

export type IPoolItem = SnapshotOut<typeof PoolItem>;

const BondItem = types.model('BondItem', {
  amount: types.string,
  currentNonce: types.string,
  depositTimestamp: types.string,
  pendingInterest: types.string,
  withdrawn: types.boolean,
  pool: types.reference(PoolItem),
});

export type IBondItem = SnapshotOut<typeof BondItem>;

const Pools = types
  .model('PoolsModel', {
    activeDeposits: types.string,
    items: types.array(PoolItem),
    deposits: types.array(BondItem),
    totalLocked: types.string,
    isRefresh: types.boolean,
  })
  .actions((self) => ({
    setActiveDeposits: (value: string) => {
      self.activeDeposits = value;
    },
    setTotalLocked: (value: string) => {
      self.totalLocked = value;
    },
    setPools: (items: IPoolItem[]) => {
      self.items = cast(items);
    },
    setDeposits: (items: IBondItem[]) => {
      self.deposits = cast(items);
    },
    refreshData: (value: boolean) => {
      self.isRefresh = value;
    },
  }));

export default Pools;
