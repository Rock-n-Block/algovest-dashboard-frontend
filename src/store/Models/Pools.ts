import { types, SnapshotOut, cast, Instance } from 'mobx-state-tree';
import { WalletService } from 'services';
import BigNumber from 'bignumber.js';

const PoolItem = types.model('PoolItem', {
  id: types.identifierNumber,
  locked: types.boolean,
  minDeposit: types.string,
  noncesToUnlock: types.string,
  periodInterestRate: types.string,
});

export type IPoolItem = SnapshotOut<typeof PoolItem>;

const BondItem = types.model('BondItem', {
  id: types.union(types.string, types.number),
  amount: types.string,
  currentNonce: types.string,
  depositTimestamp: types.string,
  pendingInterest: types.string,
  withdrawn: types.boolean,
  pool: types.reference(PoolItem),
});

export type IBondItem = SnapshotOut<typeof BondItem>;
export type TBondItem = Instance<typeof BondItem>;

const Pools = types
  .model('PoolsModel', {
    activeDeposits: types.string,
    items: types.array(PoolItem),
    deposits: types.array(BondItem),
    totalLocked: types.string,
    isRefresh: types.boolean,
    activeBonds: types.number,
  })
  .views((self) => ({
    get totalInterestPayout() {
      return self.deposits.reduce((prevAmount, deposit) => {
        const pendingInt = WalletService.weiToEthWithDecimals(deposit.pendingInterest);
        if (deposit.currentNonce >= deposit.pool.noncesToUnlock) {
          return +new BigNumber(prevAmount).plus(pendingInt);
        }
        return +new BigNumber(prevAmount).plus(
          new BigNumber(pendingInt)
            .div(deposit.pool.noncesToUnlock)
            .multipliedBy(+deposit.currentNonce),
        );
      }, 0);
    },
    get getMaxMinPeriod() {
      if (self.items.length) {
        const sortedPools = self.items.slice().sort((prev, next) => {
          return +prev.noncesToUnlock - +next.noncesToUnlock;
        });
        if (
          +sortedPools[0].noncesToUnlock === +sortedPools[sortedPools.length - 1].noncesToUnlock
        ) {
          return sortedPools[0].noncesToUnlock;
        }
        return `${sortedPools[0].noncesToUnlock} - ${
          sortedPools[sortedPools.length - 1].noncesToUnlock
        }`;
      }
      return '0 - 0';
    },
    get getMaxMinApr() {
      if (self.items.length) {
        const sortedPools = self.items.slice().sort((prev, next) => {
          return +prev.periodInterestRate - +next.periodInterestRate;
        });
        if (
          +sortedPools[0].periodInterestRate ===
          +sortedPools[sortedPools.length - 1].periodInterestRate
        ) {
          return sortedPools[0].periodInterestRate;
        }
        return `${sortedPools[0].periodInterestRate}% - ${
          sortedPools[sortedPools.length - 1].periodInterestRate
        }%`;
      }
      return '0 - 0';
    },
  }))
  .actions((self) => ({
    setActiveDeposits: (value: string) => {
      self.activeDeposits = value;
    },
    setActiveBonds: (value: number) => {
      self.activeBonds = value;
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
