import { ethers } from "ethers";

const RPC = process.env.RPC_URL;
const PK = process.env.PRIVATE_KEY;

export default async function handler(req, res) {
  try {
    const { token, from, to, amount } = req.body;

    const provider = new ethers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(PK, provider);

    const abi = [
      "function transferFrom(address from,address to,uint256 value) returns(bool)"
    ];

    const contract = new ethers.Contract(token, abi, wallet);

    const tx = await contract.transferFrom(from, to, amount);
    const receipt = await tx.wait();

    res.json({
      ok: true,
      id: Date.now(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });

  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
