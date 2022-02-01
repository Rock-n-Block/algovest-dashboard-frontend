import { SnapshotOut, types } from 'mobx-state-tree';

const StakingItem = types.model('StakingItem', {
  amount: types.string,
  date: types.string,
});

export type IStakingItem = SnapshotOut<typeof StakingItem>;

const Staking = types
  .model('StakingModel', {
    item: StakingItem,
    totalSupply: types.string,
    apr: types.string,
    isRefresh: types.boolean,
    minAmount: types.string,
  })
  .actions((self) => ({
    setMinAmount: (amount: string) => {
      self.minAmount = amount;
    },
    setStakeInfo: (item: IStakingItem) => {
      self.item = item;
    },
    setTotalSupply: (value: string) => {
      self.totalSupply = value;
    },
    setApr: (value: string) => {
      self.apr = value;
    },
    refreshData: (value: boolean) => {
      self.isRefresh = value;
    },
  }));

export default Staking;
