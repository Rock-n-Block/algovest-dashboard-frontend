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
    refreshData: () => {
      self.isRefresh = true;
      setTimeout(() => {
        self.isRefresh = false;
      }, 0);
    },
  }));

export default Staking;
