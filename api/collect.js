import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    // POST only
    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        error: "POST request required"
      });
    }

    const { token, from, to, amount } = req.body;

    if (!token || !from || !to || !amount) {
      return res.status(400).json({
        ok: false,
        error: "Missing parameters"
      });
    }

    // ENV VARIABLES
    const RPC_URL = process.env.RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    if (!RPC_URL || !PRIVATE_KEY) {
      return res.status(500).json({
        ok: false,
        error: "Server ENV not configured"
      });
    }

    // Provider + Wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // ERC20 ABI
    const abi = [
      "function transferFrom(address from,address to,uint256 value) returns(bool)"
    ];

    const contract = new ethers.Contract(token, abi, wallet);

    console.log("Relaying:", from, "→", to, amount);

    // Send transaction
    const tx = await contract.transferFrom(from, to, amount);

    const receipt = await tx.wait();

    res.status(200).json({
      ok: true,
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
