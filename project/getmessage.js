async function getMessage(receiverAddress) {
    try {
        const appInfo = await algodClient.getApplicationByID(YOUR_APP_ID).do();
        const globalState = appInfo.params["global-state"];
        
        for (let entry of globalState) {
            if (entry.key === Buffer.from(receiverAddress).toString("base64")) {
                console.log("Received Message:", Buffer.from(entry.value.bytes, "base64").toString());
            }
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

getMessage("RECEIVER_ALGO_ADDRESS");
