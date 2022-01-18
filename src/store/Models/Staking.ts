import { types } from 'mobx-state-tree';

const Staking = types
  .model('StakingModel', {
    totalStaked: types.string,
    totalSupply: types.string,
    apr: types.string,
    isRefresh: types.boolean,
  })
  .actions((self) => ({
    setTotalStaked: (value: string) => {
      self.totalStaked = value;
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
