import subprocess
import json
from constants import *
import os
from pathlib import Path
from web3 import Web3
from bit import *
from eth_account import Account
from bit import wif_to_key


w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
test = "your file path to hd-wallet-derive.php"
mnemonic = os.environ.get("MNEMONIC")


def derive_wallets(mnemonic, coin, numderive):

    """ This function creates the HD Wallet and crypto accounts """

    command = f"php {test} -g --mnemonic=\"{mnemonic}\" --numderive={numderive} --coin={coin} --cols=path,address,privkey,pubkey --format=jsonpretty"
    try:
        p = subprocess.Popen(command, stdout=subprocess.PIPE, shell=True)
        output, err = p.communicate()
        p_status = p.wait()
    except Exception as e:
        print("ERROR: ", e) 
        print(str(e))
    keys = json.loads(output)
    return keys

coins = {"eth":derive_wallets(mnemonic=mnemonic,coin=ETH,numderive=3), 'btc-test': derive_wallets(mnemonic=mnemonic,coin=BTCTEST,numderive=3)}

def priv_key_to_account(coin, priv_key):

    """ This function sends the private key to the appropiate library to manage the account in the script """

    if coin == ETH:
        return Account.privateKeyToAccount(priv_key)
    elif coin == BTCTEST:
        return PrivateKeyTestnet(priv_key)

def create_tx(coin, sender, recipient, amount):

    """ This function prepares the transaction to be sent """

    if coin == ETH:
        gasEstimate = w3.eth.estimateGas(
            {"from": sender.address, "to": recipient.address, "value": amount}
        )
        return {
            "from": sender.address,
            "to": recipient.address,
            "value": amount,
            "gasPrice": w3.eth.gasPrice,
            "gas": gasEstimate,
            "nonce": w3.eth.getTransactionCount(sender.address),
        }
    if coin == BTC:
        return PrivateKeyTestnet.prepare_transaction(sender.address, [(recipient.address, amount, BTC)])

def send_tx(coin, sender, recipient, amount):

    """ This function sends the prepared transaction from create_tx() """

    if coin == ETH:
        tx = create_tx(coin, sender, recipient, amount)
        signed_tx = sender.sign_transaction(tx)
        result = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        print(result.hex())
        return result.hex()
    if coin == BTC:
        trxns_btctest= create_tx(coin, sender,recipient,amount)
        signed = sender.sign_transaction(trxns_btctest)
        from bit.network import NetworkAPI
        return NetworkAPI.broadcast_tx_testnet(signed)

###############
# For Testing #
###############

# ETH TEST
eth_sender    = priv_key_to_account(ETH, coins["eth"][0]["privkey"])
eth_recipient = priv_key_to_account(ETH, coins["eth"][1]["privkey"])
eth_amount    = 100000000000000000000

print(eth_sender, eth_sender.address)
print(eth_recipient, eth_recipient.address)

send_tx(ETH, eth_sender, eth_recipient, eth_amount)

# BTC TEST
btc_sender    = priv_key_to_account(BTCTEST, coins["btc-test"][0]["privkey"])
btc_recipient = priv_key_to_account(BTCTEST, coins["btc-test"][1]["privkey"])
btc_amount    = .001

print(btc_sender, btc_sender.address)
print(btc_recipient, btc_recipient.address)

send_tx(BTCTEST, btc_sender, btc_recipient, btc_amount)
