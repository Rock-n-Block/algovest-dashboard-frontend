/* eslint-disable no-console */
import React from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { IBondItem, IPoolItem } from 'store/Models/Pools';

import BigNumber from 'bignumber.js';

import { contracts } from 'config';

import { useWalletConnectorContext } from 'services';

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
    try {
      const stakeInfo = await walletService.callContractMethod({
        contractName: 'AVS',
        methodName: 'balanceOf',
        contractAddress: contracts.params.AVS[contracts.type].address,
        contractAbi: contracts.params.AVS[contracts.type].abi,
        data: [contracts.params.BOND[contracts.type].address],
      });

      const amount = await walletService.weiToEth(
        contracts.params.AVS[contracts.type].address,
        stakeInfo,
      );

      staking.setTotal(amount);
    } catch (err) {
      console.log('err get total staked', err);
    }
  }, [walletService, staking]);

  const getUserStake = React.useCallback(async () => {
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
    getUserStake();
    getMinStake();
    getStakingInfo();
    getApr();
  }, [getUserStake, getStakingInfo, getApr, getMinStake, getTotalStaked]);

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

  const getTotalDeposited = React.useCallback(async () => {
    try {
      const stakeInfo = await walletService.callContractMethod({
        contractName: 'USDC',
        methodName: 'balanceOf',
        contractAddress: contracts.params.USDC[contracts.type].address,
        contractAbi: contracts.params.USDC[contracts.type].abi,
        data: [contracts.params.BOND[contracts.type].address],
      });

      const amount = await walletService.weiToEth(
        contracts.params.USDC[contracts.type].address,
        stakeInfo,
      );

      pools.setTotalLocked(amount);
    } catch (err) {
      console.log('err get total deposited', err);
    }
  }, [walletService, pools]);

  const getPoolTotalSupply = React.useCallback(async () => {
    try {
      const totalSupply = await walletService.callContractMethod({
        contractName: 'BOUND',
        methodName: 'totalSupply',
        contractAddress: contracts.params.BOND[contracts.type].address,
        contractAbi: contracts.params.BOND[contracts.type].abi,
      });

      pools.setTotalDepositors(totalSupply);
    } catch (err) {
      console.log('get total depositors', err);
    }
  }, [pools, walletService]);

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

        const bondsForStore = boundsInfo.map((bond, index) => {
          const newPendingInterest = new BigNumber(bond.amount)
            .multipliedBy(new BigNumber(pools.items[index].periodInterestRate).dividedBy(100))
            .dividedBy(365)
            .multipliedBy(7)
            .multipliedBy(bond.currentNonce)
            .toFixed(2, 1);

          return {
            id: nftIds[index],
            pool: bondPoolsIds[index],
            amount: bond.amount,
            currentNonce: bond.currentNonce,
            depositTimestamp: bond.depositTimestamp,
            pendingInterest: newPendingInterest,
            withdrawn: bond.withdrawn,
          };
        });

        // const bondsForStore = boundsInfo.map((bond, index) => ({
        //   id: nftIds[index],
        //   pool: bondPoolsIds[index],
        //   amount: bond.amount,
        //   currentNonce: bond.currentNonce,
        //   depositTimestamp: bond.depositTimestamp,
        //   pendingInterest: bond.pendingInterest,
        //   withdrawn: bond.withdrawn,
        // }));
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
        const poolWithoutNumbers = res.map((item: IPoolItem, index) => {
          return {
            id: index,
            locked: item.locked,
            minDeposit: item.minDeposit,
            noncesToUnlock: item.noncesToUnlock,
            periodInterestRate: new BigNumber(item.periodInterestRate)
              .dividedBy(10000)
              .toString(10),
          };
        });
        const activePools = poolWithoutNumbers.filter((pool) => !pool.locked);
        const scamPools = activePools
          .sort((prevPool, nextPool) => +nextPool.noncesToUnlock - +prevPool.noncesToUnlock)
          .map((pool, index) => {
            const apr = 600000 - 200000 * index;
            return {
              ...pool,
              periodInterestRate: new BigNumber(apr).dividedBy(10000).toString(10),
            };
          });
        pools.setPools(scamPools.reverse());
      });
    } catch (err) {
      console.log('err get pools', err);
    }
  }, [walletService, pools]);

  const getPoolData = React.useCallback(() => {
    getTotalDeposited();
    getActiveDeposits();
    getPools();
    getPoolTotalSupply();
    getDeposits();
  }, [getPools, getActiveDeposits, getDeposits, getPoolTotalSupply, getTotalDeposited]);

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
