const MetaMaskConnector = require("node-metamask");
const { abi, bytecode } = require("./TitleEscrow");
const ethers = require("ethers");
const connector = new MetaMaskConnector({
  port: 3333, // this is the default port
  onConnect() {
    console.log("MetaMask client connected");
  } // Function to run when MetaMask is connected (optional)
});

let provider;
let factory;
let userSigner;
let userAddress;
let userNonce;
let fromAddress;
(async () => {
  await connector.start()
      // Now go to http://localhost:3333 in your MetaMask enabled web browser.
      provider = new ethers.providers.Web3Provider(connector.getProvider());
      // Use web3 as you would normally do. Sign transactions in the browser.
      provider.on("block", console.log);
  
      
      userSigner = provider.getSigner()
      userAddress = await userSigner.getAddress()
      userNonce = await provider.getTransactionCount(userAddress)
      fromAddress = ethers.utils.getContractAddress({from: userAddress, nonce: userNonce})
      factory = new ethers.ContractFactory(abi, bytecode, provider.getSigner());
      const tx1 = factory.deploy(
        "0xBb1D91cf2f2878F80563a0FABD3e73213869720a",
        "0xBb1D91cf2f2878F80563a0FABD3e73213869720a",
        "0xBb1D91cf2f2878F80563a0FABD3e73213869720a",
        {
          gasPrice: ethers.utils.parseUnits("50.0", "gwei")
        }
      );
  
      const tx2 = factory.deploy(fromAddress, fromAddress, fromAddress, {
        gasPrice: ethers.utils.parseUnits("50.0", "gwei")
      });
      
      console.log(await tx1, await tx2);
})();
