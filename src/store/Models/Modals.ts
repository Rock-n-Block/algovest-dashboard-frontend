import { types } from 'mobx-state-tree';

const WalletConnect = types
  .model({
    isOpen: types.optional(types.boolean, false),
  })
  .actions((self) => {
    return {
      close: () => {
        self.isOpen = false;
      },
      open: () => {
        self.isOpen = true;
      },
    };
  });

const Modals = types.model({
  walletConnect: WalletConnect,
});
export default Modals;
