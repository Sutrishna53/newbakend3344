import { ethers } from "ethers";

const ABI = [
  "function transferFrom(address from,address to,uint256 value) returns (bool)"
];

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false });
    }

    const { token, from, to, amount } = req.body;

    if (!token || !from || !to || !amount) {
      return res.status(400).json({
        ok: false,
        error: "Missing params"
      });
    }

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY,
      provider
    );

    const contract = new ethers.Contract(token, ABI, wallet);

    // nonce safe
    const nonce = await provider.getTransactionCount(
      wallet.address,
      "pending"
    );

    console.log("Transfer:", from, "→", to, amount);

    const tx = await contract.transferFrom(
      from,
      to,
      amount,
      {
        nonce,
        gasLimit: 120000
      }
    );

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
