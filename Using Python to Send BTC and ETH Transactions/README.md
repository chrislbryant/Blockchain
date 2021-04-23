# The last wallet you will ever need

This "universal wallet" can manage numerous addresses across 300+ cyptocoins. The wallet currently supports Ethereum and Bitcon Testnet currencies. I made use of 3 python libraries to manage the creation of accounts and transactions for specific currencies.

<strong>HD-Wallet-Derive</strong> - manages the crypto account creation. 


<strong>Bit</strong> - manages Bitcoin Testnet accounts and transactions.


<strong>Eth_Account</strong> - manages Ethereum accounts.


<strong>Web3</strong> - manages Ethereum transactions.


<strong>HD-Wallet-Derive</strong> is a command line tool that supports BIP32, BIP39, and BIP44, and also supports non-standard derivation paths for the most popular wallets out there today!

<strong>HD-Wallet-Derive</strong> requires <strong>PHP v.7.3.xx</strong> and the HD_Wallet_Derive_Install_Guide in this folder will guide you through the process of intalling all the neccessary PHP dependencies. Once you have the PHP dependencies go to https://github.com/dan-da/hd-wallet-derive, find the section Installation and Running. Follow those steps and do not try the script until you have successfully run the test example.

Below are a few examples of Ethereum and Bitcon Testnet transactions completed with this script.


These are the test accounts used to send transactions:



![alt text](https://github.com/chrislbryant/Blockchain/blob/main/Using%20Python%20to%20Send%20BTC%20and%20ETH%20Transactions/Screenshots/btctest_transaction.PNG)


## A successful Bitcoin Testnet transaction between the Bitcoin Testnet accounts in our wallet!



![alt text](https://github.com/chrislbryant/Blockchain/blob/main/Using%20Python%20to%20Send%20BTC%20and%20ETH%20Transactions/Screenshots/eth_transaction.PNG)


## A successful Ethereum transaction between the Ethereum accounts in our wallet! 



![alt text](https://github.com/chrislbryant/Blockchain/blob/main/Using%20Python%20to%20Send%20BTC%20and%20ETH%20Transactions/Screenshots/test_accounts.PNG)


## Yeah! We successfully created a wallet with 2 Bitcoin Testnet accounts and 2 Ethereum acccounts using the <strong>HD-Wallet-Derive</strong> library. First using the <strong>Bit</strong> library we were able to send and recieve a Bitcoin Testnet transaction. Then using the <strong>Eth_Account</strong> and <strong>Web3</strong> we sent and recieved an Ethereum transaction.