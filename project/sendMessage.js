const algosdk = require("algosdk");
require("dotenv").config();

const algodToken = "YOUR_ALGOD_TOKEN";  
const algodServer = "https://testnet-api.algonode.cloud";
const algodPort = "";

const senderMnemonic = "YOUR_WALLET_MNEMONIC";  
const receiverAddress = "RECEIVER_ALGO_ADDRESS";  

const message = "Hello, this is a blockchain message!";

// Initialize Algorand client
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);

async function sendMessage() {
    try {
        const params = await algodClient.getTransactionParams().do();

        const appArgs = [
            new Uint8Array(Buffer.from(receiverAddress)),
            new Uint8Array(Buffer.from(message)),
        ];

        const txn = algosdk.makeApplicationCallTxnFromObject({
            from: senderAccount.addr,
            appIndex: YOUR_APP_ID,  
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            appArgs,
            suggestedParams: params,
        });

        const signedTxn = txn.signTxn(senderAccount.sk);
        const txId = txn.txID().toString();
        await algodClient.sendRawTransaction(signedTxn).do();

        console.log(`Transaction ID: ${txId}`);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

sendMessage();
