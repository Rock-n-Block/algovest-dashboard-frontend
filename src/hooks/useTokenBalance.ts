// import { useCallback, useEffect, useState } from 'react';

// import { useWalletConnectorContext, WalletService } from 'services';
// import { TNullable } from 'typings';

// export default (
//   userAddress: TNullable<string>,
//   tokenAddress: string,
//   refresh = false,
//   isIntervalUpdate = false,
// ) => {
//   const [balance, setBalance] = useState<string>('');

//   const { walletService } = useWalletConnectorContext();

//   const getUserTokenBalance = useCallback(async () => {
//     const decimals = await walletService.getTokenDecimals(tokenAddress);
//     const tokenBalance = await walletService.getTokenBalance(tokenAddress);

//     setBalance(WalletService.weiToEth(tokenBalance.toString(), decimals));
//   }, [tokenAddress, walletService]);

//   useEffect(() => {
//     let interval: any = null;
//     if (userAddress || (userAddress && refresh)) {
//       getUserTokenBalance();

//       if (isIntervalUpdate && !interval) {
//         interval = setInterval(getUserTokenBalance, 30000);
//       }
//     }
//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [getUserTokenBalance, userAddress, refresh, isIntervalUpdate]);

//   return balance;
// };
export default () => {};
