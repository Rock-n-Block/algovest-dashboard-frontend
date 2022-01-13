import { types } from 'mobx-state-tree';

const WalletConnect = types
  .model('WalletConnectModel', {
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

const Modals = types.model('ModalsModel', {
  walletConnect: WalletConnect,
});
export default Modals;
