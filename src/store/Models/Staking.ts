import { types } from 'mobx-state-tree';

const Staking = types
  .model('StakingModel', {
    totalStaked: types.string,
    totalSupply: types.string,
  })
  .actions((self) => ({
    setTotalStaked: (value: string) => {
      self.totalStaked = value;
    },
    setTotalSupply: (value: string) => {
      self.totalSupply = value;
    },
  }));

export default Staking;
