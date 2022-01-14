import React from 'react';

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
      debugger;
      const totalSupply = await walletService.callContractMethod({
        contractName: 'AVS',
        methodName: 'totalSupply',
        contractAddress: contracts.params.AVS[contracts.type].address,
        contractAbi: contracts.params.AVS[contracts.type].abi,
      });

      const amount = await walletService.weiToEth(
        contracts.params.AVS[contracts.type].address,
        totalSupply.amount,
      );
      staking.setTotalSupply(amount);
    } catch (err) {
      console.log('err getStakingInfo', err);
    }
  }, [staking, walletService]);

  React.useEffect(() => {
    debugger;
    if (walletService.Web3()) {
      getTotalStaked();
      getStakingInfo();
    }
  }, [getTotalStaked, getStakingInfo, walletService]);

  return <>{children}</>;
};

export default GetData;
