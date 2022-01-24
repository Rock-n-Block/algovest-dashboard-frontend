import { INetwork } from '@amfi/connect-wallet/dist/interface';

import { chainsEnum, IConnectWallet, IContracts } from 'typings';

import { ERC20Abi, BondAbi } from './abi';

export const is_production = false;

export const chains: {
  [key: string]: {
    name: chainsEnum;
    network: INetwork;
    provider: {
      [key: string]: any;
    };
    explorer: string;
  };
} = {
  [chainsEnum.Ethereum]: {
    name: chainsEnum.Ethereum,
    network: {
      chainName: chainsEnum.Ethereum,
      chainID: is_production ? 1 : 4,
    },
    explorer: is_production ? '' : '',
    provider: {
      MetaMask: { name: 'MetaMask' },
      WalletConnect: {
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [is_production ? 1 : 4]: is_production
                ? 'https://bsc-dataseed.binance.org/'
                : 'https://data-seed-prebsc-2-s1.binance.org:8545/',
            },
            chainId: is_production ? 1 : 4,
          },
        },
      },
    },
  },
};

export const connectWallet = (chainName: chainsEnum): IConnectWallet => {
  const chain = chains[chainName];

  return {
    wallets: ['MetaMask'],
    network: chain.network,
    provider: chain.provider,
    settings: { providerType: true },
  };
};

export const contracts: IContracts = {
  type: is_production ? 'mainnet' : 'testnet',
  names: ['STAKING', 'QUACK', 'VOTING'],
  params: {
    AVS: {
      mainnet: {
        address: '',
        abi: ERC20Abi,
      },
      testnet: {
        address: '0x0ed7a4363996873fcf1666e0f973f533e28052fa',
        abi: ERC20Abi,
      },
    },
    USDC: {
      mainnet: {
        address: '',
        abi: ERC20Abi,
      },
      testnet: {
        address: '0x0ed7a4363996873fcf1666e0f973f533e28052fa',
        abi: ERC20Abi,
      },
    },
    BOND: {
      mainnet: {
        address: '',
        abi: BondAbi,
      },
      testnet: {
        address: '0x9C81909D3Af174f521290d0673acAc4583542777',
        abi: BondAbi,
      },
    },
  },
};
