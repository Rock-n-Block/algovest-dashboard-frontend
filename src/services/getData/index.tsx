import React from 'react';
import BigNumber from 'bignumber.js';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from 'services';
import { contracts } from 'config';
import { useMst } from 'store';
import { IPoolItem, IBondItem } from 'store/Models/Pools';

const GetData: React.FC = ({ children }) => {
  const { walletService } = useWalletConnectorContext();
  const { user, staking, pools } = useMst();

  // start staking

  const getMinStake = React.useCallback(async () => {
    try {
      const minStakeAmount = await walletService.callContractMethod({
        contractName: 'BOUND',
        methodName: 'stakingAmount',
        contractAddress: contracts.params.BOND[contracts.type].address,
        contractAbi: contracts.params.BOND[contracts.type].abi,
      });

      const amount = await walletService.weiToEth(
        contracts.params.AVS[contracts.type].address,
        minStakeAmount,
      );

      staking.setMinAmount(amount);
    } catch (err) {
      console.log('err get total staked', err);
    }
  }, [walletService, staking]);

  const getTotalStaked = React.useCallback(async () => {
    if (user.address) {
      try {
        const stakeInfo = await walletService.callContractMethod({
          contractName: 'BOUND',
          methodName: 'stakesInfo',
          contractAddress: contracts.params.BOND[contracts.type].address,
          contractAbi: contracts.params.BOND[contracts.type].abi,
          data: [user.address],
        });

        const amount = await walletService.weiToEth(
          contracts.params.AVS[contracts.type].address,
          stakeInfo.amount,
        );

        staking.setStakeInfo({ amount, date: stakeInfo.stakedAt });
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
      staking.setApr(new BigNumber(apr).dividedBy(10000).toString(10));
    } catch (err) {
      console.log('err getApr', err);
    }
  }, [staking, walletService]);

  const getStakingData = React.useCallback(() => {
    getTotalStaked();
    getMinStake();
    getStakingInfo();
    getApr();
  }, [getTotalStaked, getStakingInfo, getApr, getMinStake]);

  React.useEffect(() => {
    getStakingData();
  }, [getStakingData]);

  React.useEffect(() => {
    if (staking.isRefresh) {
      getStakingData();
      staking.refreshData(false);
    }
  }, [getStakingData, staking.isRefresh, staking]);

  // end staking

  // start pool

  const getActiveDeposits = React.useCallback(async () => {
    try {
      const activeDeposits = await walletService.callContractMethod({
        contractName: 'BOUND',
        methodName: 'inTrading',
        contractAddress: contracts.params.BOND[contracts.type].address,
        contractAbi: contracts.params.BOND[contracts.type].abi,
      });

      const amount = await walletService.weiToEth(
        contracts.params.USDC[contracts.type].address,
        activeDeposits,
      );

      pools.setActiveDeposits(amount);
    } catch (err) {
      console.log('err get total staked', err);
    }
  }, [walletService, pools]);

  const getDeposits = React.useCallback(async () => {
    if (user.address) {
      try {
        const bondsCount = await walletService.callContractMethod({
          contractName: 'BOND',
          methodName: 'balanceOf',
          contractAddress: contracts.params.BOND[contracts.type].address,
          contractAbi: contracts.params.BOND[contracts.type].abi,
          data: [user.address],
        });

        pools.setActiveBonds(+bondsCount);

        const nftIdsPromises: Array<Promise<string>> = new Array(+bondsCount)
          .fill(0)
          .map((_, index) =>
            walletService.callContractMethod({
              contractName: 'BOND',
              methodName: 'tokenOfOwnerByIndex',
              contractAddress: contracts.params.BOND[contracts.type].address,
              contractAbi: contracts.params.BOND[contracts.type].abi,
              data: [user.address, index],
            }),
          );

        const nftIds = await Promise.all(nftIdsPromises);

        const bondPoolsIdsPromises: Array<Promise<string>> = nftIds.map((nftId) =>
          walletService.callContractMethod({
            contractName: 'BOND',
            methodName: 'bondPool',
            contractAddress: contracts.params.BOND[contracts.type].address,
            contractAbi: contracts.params.BOND[contracts.type].abi,
            data: [nftId],
          }),
        );

        const bondPoolsIds = await Promise.all(bondPoolsIdsPromises);

        const boundsInfoPromises: Array<Promise<IBondItem>> = bondPoolsIds.map(
          (boundPoolId, index) =>
            walletService.callContractMethod({
              contractName: 'BOND',
              methodName: 'bondInfo',
              contractAddress: contracts.params.BOND[contracts.type].address,
              contractAbi: contracts.params.BOND[contracts.type].abi,
              data: [boundPoolId, nftIds[index]],
            }),
        );

        const boundsInfo = await Promise.all(boundsInfoPromises);

        const amount = boundsInfo.reduce((prevAmount, bond) => {
          if (!bond.withdrawn) {
            return +new BigNumber(prevAmount).plus(bond.amount);
          }
          return prevAmount;
        }, 0);

        const totalLocked = await walletService.weiToEth(
          contracts.params.USDC[contracts.type].address,
          amount,
        );

        pools.setTotalLocked(totalLocked);

        const bondsForStore = boundsInfo.map((bond, index) => ({
          id: nftIds[index],
          pool: bondPoolsIds[index],
          amount: bond.amount,
          currentNonce: bond.currentNonce,
          depositTimestamp: bond.depositTimestamp,
          pendingInterest: bond.pendingInterest,
          withdrawn: bond.withdrawn,
        }));
        pools.setDeposits(bondsForStore.reverse());
      } catch (err) {
        console.log('err get deposits', err);
      }
    }
  }, [walletService, user.address, pools]);

  const getPools = React.useCallback(async () => {
    try {
      const poolsCount = await walletService.callContractMethod({
        contractName: 'BOND',
        methodName: 'poolLength',
        contractAddress: contracts.params.BOND[contracts.type].address,
        contractAbi: contracts.params.BOND[contracts.type].abi,
      });

      const promises: Array<Promise<IPoolItem>> = new Array(+poolsCount).fill(0).map((_, index) =>
        walletService.callContractMethod({
          contractName: 'BOND',
          methodName: 'poolInfo',
          contractAddress: contracts.params.BOND[contracts.type].address,
          contractAbi: contracts.params.BOND[contracts.type].abi,
          data: [index],
        }),
      );

      Promise.all(promises).then((res) => {
        const activePools = res.filter((pool) => !pool.locked);
        const poolWithoutNumbers = activePools.map((item: IPoolItem, index) => ({
          id: index,
          locked: item.locked,
          minDeposit: item.minDeposit,
          noncesToUnlock: item.noncesToUnlock,
          periodInterestRate: item.periodInterestRate,
        }));
        pools.setPools(poolWithoutNumbers);
      });
    } catch (err) {
      console.log('err get pools', err);
    }
  }, [walletService, pools]);

  const getPoolData = React.useCallback(() => {
    getActiveDeposits();
    getPools();
    getDeposits();
  }, [getPools, getActiveDeposits, getDeposits]);

  React.useEffect(() => {
    getPoolData();
    // const iterval = setInterval(getPoolData, 60000);

    // return () => {
    //   clearInterval(iterval);
    // };
  }, [getPoolData]);

  React.useEffect(() => {
    if (pools.isRefresh) {
      getPoolData();
      pools.refreshData(false);
    }
  }, [getPoolData, pools.isRefresh, pools]);

  // end pool

  return <>{children}</>;
};

export default observer(GetData);
