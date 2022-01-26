import { ConnectWallet } from '@amfi/connect-wallet';
import { IConnect, IError } from '@amfi/connect-wallet/dist/interface';
import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';

import { connectWallet as connectWalletConfig, contracts } from 'config';
import { ERC20Abi } from 'config/abi';

import { chainsEnum } from 'typings';
import { Erc20 } from 'typings/abis/erc20';
// import { Bond } from 'typings/abis/bond';

// enum ContractsEnum {
//   BOND = 'BOND'
// }

// const selectedContractType = {
//   [ContractsEnum.BOND]: Bond
// }

export class WalletService {
  public connectWallet: ConnectWallet;

  public walletAddress = '';

  public contracts: any = {};

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(
    chainName: chainsEnum,
    providerName: 'MetaMask' | 'WalletConnect',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const { provider, network, settings } = connectWalletConfig(chainName);

      const connecting = this.connectWallet
        .connect(provider[providerName], network, settings)
        .then((connected: boolean | {}) => {
          return connected;
        })
        .catch((err: any) => {
          console.error('initWalletConnect providerWallet err: ', err);
        });

      Promise.all([connecting]).then((connect: any) => {
        resolve(connect[0]);
      });
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  public async getTokenBalance(address: string) {
    const contract = this.connectWallet.getContract({
      address,
      abi: ERC20Abi as any[],
    }) as any as Erc20;

    return contract.methods.balanceOf(this.walletAddress).call();
  }

  public async getTokenDecimals(address: string) {
    const contract = this.connectWallet.getContract({
      address,
      abi: ERC20Abi as any[],
    }) as any as Erc20;

    return contract.methods.decimals().call();
  }

  public setAccountAddress(address: string) {
    this.walletAddress = address;
  }

  public getAccount(): Promise<
    | IConnect
    | IError
    | {
        address: string;
      }
  > {
    return this.connectWallet.getAccounts();
  }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.Web3().eth.abi.encodeFunctionCall(abi, data);
  }

  async createTransaction({
    method,
    data,
    contract,
    tx,
    to,
    walletAddress,
    value,
  }: {
    method: string;
    data: Array<any>;
    contract: 'BOND';
    tx?: any;
    to?: string;
    walletAddress?: string;
    value?: any;
  }) {
    const transactionMethod = WalletService.getMethodInterface(
      contracts.params[contract][contracts.type].abi,
      method,
    );

    let signature;
    if (transactionMethod) {
      signature = this.encodeFunctionCall(transactionMethod, data);
    }

    if (tx) {
      tx.from = walletAddress || this.walletAddress;
      tx.data = signature;

      return this.sendTransaction(tx);
    }
    return this.sendTransaction({
      from: walletAddress || this.walletAddress,
      to: to || contracts.params[contract][contracts.type].address,
      data: signature || '',
      value: value || '',
    });
  }

  sendTransaction(transactionConfig: any) {
    return this.Web3().eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }

  async totalSupply(tokenAddress: string, abi: Array<any>, tokenDecimals: number) {
    const contract = this.connectWallet.getContract({ address: tokenAddress, abi });
    const totalSupply = await contract.methods.totalSupply().call();

    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  async checkTokenAllowance({
    contractName,
    approvedAddress,
    walletAddress,
    amount,
  }: {
    contractName: string;
    approvedAddress?: string;
    walletAddress?: string;
    amount?: string | number;
  }): Promise<boolean> {
    try {
      const contract = this.connectWallet.getContract({
        address: contracts.params[contractName][contracts.type].address,
        abi: contracts.params[contractName][contracts.type].abi,
      });
      const walletAdr = walletAddress || this.walletAddress;

      let result = await contract.methods
        .allowance(
          walletAdr,
          approvedAddress || contracts.params[contractName][contracts.type].address,
        )
        .call();

      const tokenDecimals = await this.getTokenDecimals(
        contracts.params[contractName][contracts.type].address,
      );

      result =
        result === '0'
          ? null
          : +new BigNumber(result).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
      if (result && new BigNumber(result).minus(amount || 0).isPositive()) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async approveToken({
    contractName,
    approvedAddress,
    walletAddress,
  }: {
    contractName: string;
    approvedAddress?: string;
    walletAddress?: string;
  }) {
    try {
      const approveMethod = WalletService.getMethodInterface(
        contracts.params[contractName][contracts.type].abi,
        'approve',
      );

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        approvedAddress || walletAddress || this.walletAddress,
        '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      ]);

      return this.sendTransaction({
        from: walletAddress || this.walletAddress,
        to: contracts.params[contractName][contracts.type].address,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  public async calcTransactionAmount(
    tokenContract: string,
    amount: number | string,
  ): Promise<string> {
    if (amount === '0') {
      return amount;
    }
    const tokenDecimals = await this.getTokenDecimals(tokenContract);
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  public async weiToEth(tokenContract: string, amount: number | string): Promise<string> {
    if (amount === '0') {
      return amount;
    }
    const tokenDecimals = await this.getTokenDecimals(tokenContract);
    return new BigNumber(amount).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  static weiToEthWithDecimals(amount: number | string, decimals = 18): string {
    return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toString(10);
  }

  static ethToWei(amount: number | string, decimals = 18): string {
    return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toString(10);
  }

  static getAddress(contractName: string): string {
    return contracts.params[contractName][contracts.type].address;
  }

  createContract(contractName: string, contractAddress: string, abi: Array<any>) {
    if (!this.contracts[contractName]) {
      const contract = this.connectWallet.getContract({ address: contractAddress, abi });
      this.contracts = {
        ...this.contracts,
        [contractName]: contract,
      };
    }
  }

  async callContractMethod({
    contractName,
    methodName,
    data = [],
    contractAddress,
    contractAbi,
  }: {
    contractName: string;
    methodName: string;
    data?: any[];
    contractAddress: string;
    contractAbi: Array<any>;
  }) {
    try {
      if (!this.contracts[contractName] && contractAddress && contractAbi) {
        this.createContract(contractName, contractAddress, contractAbi);
      }

      if (this.contracts[contractName]) {
        const method = await this.contracts[contractName].methods[methodName];
        return await method(...data).call();
      }
    } catch (err: any) {
      throw new Error(err);
    }
    return new Error(`contract ${contractName} didn't created`);
  }
}
