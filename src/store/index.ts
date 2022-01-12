import { createContext, useContext } from 'react';

import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { Modals, UserModel } from './Models';

const RootModel = types.model({
  user: UserModel,
  modals: Modals,
});

export const Store = RootModel.create({
  user: {
    address: null,
  },
  modals: {
    walletConnect: { isOpen: false },
  },
});

const rootStore = Store;

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
