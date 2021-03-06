import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { TNullable } from 'typings';

import { useWalletConnectorContext } from 'services';

export default (
  userAddress: TNullable<string>,
  tokenAddress: string,
  isIntervalUpdate = false,
): [string, string] => {
  const [balance, setBalance] = useState<string>('');
  const [decimals, setDecimals] = useState<string>('');

  const { walletService } = useWalletConnectorContext();

  const getUserTokenBalance = useCallback(async () => {
    const tokenBalance = await walletService.getTokenBalance(tokenAddress);
    const amount = await walletService.weiToEth(tokenAddress, tokenBalance);

    setBalance(new BigNumber(amount).toFixed(3, 1));
  }, [tokenAddress, walletService]);

  const getTokenDecimals = useCallback(async () => {
    const tokenDecimals = await walletService.getTokenDecimals(tokenAddress);
    setDecimals(tokenDecimals);
  }, [tokenAddress, walletService]);

  useEffect(() => {
    getTokenDecimals();
  }, [getTokenDecimals]);

  useEffect(() => {
    let interval: any = null;
    if (userAddress) {
      getUserTokenBalance();

      if (isIntervalUpdate && !interval) {
        interval = setInterval(getUserTokenBalance, 30000);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [getUserTokenBalance, userAddress, isIntervalUpdate]);

  return [balance, decimals];
};
