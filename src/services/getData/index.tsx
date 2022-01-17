import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { useWalletConnectorContext } from 'services';
import { contracts } from 'config';
import { useMst } from 'store';

const GetData: React.FC = ({ children }) => {
  const { walletService } = useWalletConnectorContext();
  const { user, staking } = useMst();

  const getTotalStaked = React.useCallback(async () => {
    if (user.address) {
      try {
        const totalStaked = await walletService.callContractMethod({
          contractName: 'BOUND',
          methodName: 'stakesInfo',
          contractAddress: contracts.params.BOND[contracts.type].address,
          contractAbi: contracts.params.BOND[contracts.type].abi,
          data: [user.address],
        });

        const amount = await walletService.weiToEth(
          contracts.params.AVS[contracts.type].address,
          totalStaked.amount,
        );

        staking.setTotalStaked(amount);
      } catch (err) {
        console.log('err get total staked', err);
      }
    }
  }, [user.address, walletService, staking]);

  const getStakingInfo = React.useCallback(async () => {
    try {
      const totalSupply = await walletService.callContractMethod({
        contractName: 'AVS',
        methodName: 'totalSupply',
        contractAddress: contracts.params.AVS[contracts.type].address,
        contractAbi: contracts.params.AVS[contracts.type].abi,
      });

      const amount = await walletService.weiToEth(
        contracts.params.AVS[contracts.type].address,
        totalSupply,
      );
      staking.setTotalSupply(amount);
    } catch (err) {
      console.log('err getStakingInfo', err);
    }
  }, [staking, walletService]);

  const getApr = React.useCallback(async () => {
    try {
      const apr = await walletService.callContractMethod({
        contractName: 'BOND',
        methodName: 'rewardAPY',
        contractAddress: contracts.params.BOND[contracts.type].address,
        contractAbi: contracts.params.BOND[contracts.type].abi,
      });
      staking.setApr(new BigNumber(apr).dividedBy(100).toString(10));
    } catch (err) {
      console.log('err getApr', err);
    }
  }, [staking, walletService]);

  const getStakingData = React.useCallback(() => {
    getTotalStaked();
    getStakingInfo();
    getApr();
  }, [getTotalStaked, getStakingInfo, getApr]);

  React.useEffect(() => {
    getStakingData();
  }, [getStakingData]);

  React.useEffect(() => {
    if (staking.isRefresh) {
      getStakingData();
    }
  }, [getStakingData, staking.isRefresh]);

  return <>{children}</>;
};

export default GetData;
