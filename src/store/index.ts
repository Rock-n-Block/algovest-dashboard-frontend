import { createContext, useContext } from 'react';

import makeInspectable from 'mobx-devtools-mst';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { Modals, Pools, Staking, UserModel } from './Models';

const RootModel = types.model('RootModel', {
  user: UserModel,
  modals: Modals,
  staking: Staking,
  pools: Pools,
});

export const rootStore = RootModel.create({
  user: {
    address: null,
  },
  modals: {
    walletConnect: { isOpen: false },
  },
  staking: {
    item: { amount: '0', date: '0' },
    totalSupply: '0',
    apr: '0',
    isRefresh: false,
    minAmount: '0',
    total: '0',
  },
  pools: {
    activeBonds: 0,
    activeDeposits: '0',
    totalLocked: '0',
    items: [],
    isRefresh: false,
    totalDepositors: '0',
  },
});

makeInspectable(rootStore);

export type RootInstance = Instance<typeof RootModel>;

const RootStoreContext = createContext<RootInstance | null>(null);

export const { Provider } = RootStoreContext;

onSnapshot(rootStore, (snapshot) => {
  // eslint-disable-next-line no-console
  console.log(snapshot);
});

export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw Error('Store cannot be null, please add a context provider');
  }
  return store;
}

export default rootStore;
