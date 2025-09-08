import { walletClient } from "../client";

let accounts: Array<`0x${string}`> = [];

async function getAccounts() {
  accounts = await walletClient.getAddresses();
  if (accounts.length > 0) {
    console.log('Connected wallet:', accounts[0]);
  } else {
    alert('No wallet connected');
    console.log('No wallet connected');
  }
}

const connectAccount = async () => {
    try {
        if (accounts.length === 0) {
            const [address] = await walletClient.requestAddresses();
            // setCurrentAccount(address);
            return address;
        } else {
            // setCurrentAccount(accounts[0]);
            return accounts[0];
        }
    } catch (errors) {
        console.error('Error connecting wallet:', errors);
        throw errors;
    }
}

export {
    accounts,
    getAccounts,
    connectAccount
};