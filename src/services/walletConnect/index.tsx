import React, { createContext, useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import { WalletService } from 'services/walletService';
import { chainsEnum } from 'typings';

declare global {
  interface Window {
    ethereum: any;
    kardiachain: any;
  }
}

const walletConnectorContext = createContext<{
  connect: (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => Promise<any>;
  disconnect: () => void;
  walletService: WalletService;
}>({
  connect: async () => {},
  disconnect: (): void => {},
  walletService: new WalletService(),
});

const WalletConnector: React.FC = ({ children }) => {
  const { user } = useMst();
  const provider = React.useRef<WalletService>(new WalletService());

  const disconnect = React.useCallback(() => {
    delete localStorage.algovest_logged;
    user.disconnect();
  }, [user]);

  const connect = React.useCallback(
    async (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => {
      if (window.ethereum) {
        try {
          const isConnected = await provider.current.initWalletConnect(
            chainName,
            providerName as any,
          );

          if (isConnected) {
            try {
              const { address }: any = await provider.current.getAccount();
              provider.current.setAccountAddress(address);
              user.setAddress(address);
              localStorage.algovest_logged = true;
              localStorage.alogovest_providerName = providerName;

              const eventSubs = provider.current.connectWallet.eventSubscriber().subscribe(
                (res: any) => {
                  if (res.name === 'accountsChanged' && user.address !== res.address) {
                    disconnect();
                  }
                },
                (err: any) => {
                  console.log(err);
                  eventSubs.unsubscribe();
                  disconnect();
                },
              );
              return address;
            } catch (err: any) {
              console.error('getAccount wallet connect - get user account err: ', err);
              if (!(err.code && err.code === 6)) {
                disconnect();
              }
            }
          }
        } catch (err) {
          console.error(err);
          disconnect();
          throw new Error();
        }
      }
      throw new Error();
    },
    [disconnect, user],
  );

  React.useEffect(() => {
    if (window.ethereum && localStorage.algovest_logged && localStorage.alogovest_providerName) {
      connect(chainsEnum.Ethereum, localStorage.alogovest_providerName);
    } else {
      provider.current.connectWallet.initWeb3(
        'https://rinkeby.infura.io/v3/fc1488a3d7ef48ca9aae608015951fd2',
      );
    }
  }, [connect]);

  return (
    <walletConnectorContext.Provider
      value={{
        walletService: provider.current,
        connect,
        disconnect,
      }}
    >
      {children}
    </walletConnectorContext.Provider>
  );
};

export default observer(WalletConnector);

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
