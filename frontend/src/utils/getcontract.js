import { ethers } from "ethers";
import abi from "../FoodTrace.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask");
  }
  // Ethers v6 BrowserProvider
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
};
