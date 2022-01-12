import { types } from 'mobx-state-tree';

const UserModel = types
  .model({
    address: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setAddress: (address: string) => {
      self.address = address;
    },
    disconnect: () => {
      self.address = null;
    },
  }));
export default UserModel;
