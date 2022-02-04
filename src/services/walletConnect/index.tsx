import React, { createContext, useContext } from 'react';

import { observer } from 'mobx-react';
import { rootStore } from 'store';

import { chainsEnum } from 'typings';

import { WalletService } from 'services/walletService';

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.state.provider.connectWallet.initWeb3(
      'https://mainnet.infura.io/v3/d21662b57aec47daa7b87f182cd87e0b',
    );
    if (window.ethereum && localStorage.algovest_logged && localStorage.algovest_provider) {
      this.connect(chainsEnum.Ethereum, localStorage.algovest_provider);
    }
  }

  connect = async (chainName: chainsEnum, providerName: 'MetaMask' | 'WalletConnect') => {
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
              // eslint-disable-next-line no-console
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
