import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';
import makeInspectable from 'mobx-devtools-mst';

import { Modals, UserModel, Staking, Pools } from './Models';

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
    totalStaked: '0',
    totalSupply: '0',
    apr: '0',
    isRefresh: false,
  },
  pools: {
    activeDeposits: '0',
    items: [],
    isRefresh: false,
  },
});

makeInspectable(rootStore);

export type RootInstance = Instance<typeof RootModel>;

const RootStoreContext = createContext<RootInstance | null>(null);

export const { Provider } = RootStoreContext;

onSnapshot(rootStore, (snapshot) => {
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
