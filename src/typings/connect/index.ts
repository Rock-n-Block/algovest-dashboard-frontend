import { INetwork, IProvider, ISettings } from '@amfi/connect-wallet/dist/interface';

export enum chainsEnum {
  Ethereum = 'Ethereum',
}

export interface IConnectWallet {
  wallets: string[];
  network: INetwork;
  provider: {
    [index: string]: IProvider;
  };
  settings: ISettings;
}
export interface IChainConfig {
  name: string;
  id: number;
  rpc: string;
  tx: {
    link: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExp: string;
}

export interface IContracts {
  names: string[];
  type: 'mainnet' | 'testnet';
  params: {
    [index: string]: {
      mainnet: {
        address: string;
        abi: any[];
      };
      testnet: {
        address: string;
        abi: any[];
      };
    };
  };
}
