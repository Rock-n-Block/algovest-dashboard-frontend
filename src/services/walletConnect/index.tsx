import React, { createContext, useContext } from 'react';

import { observer } from 'mobx-react';
import { rootStore } from 'store';

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

@observer
class Connector extends React.Component<
  any,
  {
    provider: WalletService;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: new WalletService(),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    this.state.provider.connectWallet.initWeb3(
      'https://rinkeby.infura.io/v3/fc1488a3d7ef48ca9aae608015951fd2',
    );
    if (window.ethereum && localStorage.algovest_logged && localStorage.algovest_provider) {
      this.connect(chainsEnum.Ethereum, localStorage.algovest_provider);
    }
  }

  connect = async (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => {
    if (window.ethereum) {
      try {
        const isConnected = await this.state.provider.initWalletConnect(
          chainName,
          providerName as any,
        );

        if (isConnected) {
          try {
            const { address }: any = await this.state.provider.getAccount();
            this.state.provider.setAccountAddress(address);
            rootStore.user.setAddress(address);
            localStorage.algovest_logged = true;
            localStorage.algovest_provider = providerName;

            const eventSubs = this.state.provider.connectWallet.eventSubscriber().subscribe(
              (res: any) => {
                if (res.name === 'accountsChanged' && rootStore.user.address !== res.address) {
                  this.disconnect();
                }
              },
              (err: any) => {
                console.log(err);
                eventSubs.unsubscribe();
                this.disconnect();
              },
            );
            return address;
          } catch (err: any) {
            console.error('getAccount wallet connect - get user account err: ', err);
            if (!(err.code && err.code === 6)) {
              this.disconnect();
            }
          }
        }
      } catch (err) {
        console.error(err);
        this.disconnect();
        throw new Error();
      }
    }
    throw new Error();
  };

  disconnect = () => {
    delete localStorage.algovest_logged;
    delete localStorage.algovest_provider;
    rootStore.user.disconnect();
  };

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          walletService: this.state.provider,
          connect: this.connect,
          disconnect: this.disconnect,
        }}
      >
        {this.props.children}
      </walletConnectorContext.Provider>
    );
  }
}

export default Connector;

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}
