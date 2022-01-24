import { types, SnapshotOut } from 'mobx-state-tree';

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
  })
  .actions((self) => ({
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
