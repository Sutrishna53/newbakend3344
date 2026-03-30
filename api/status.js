import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    res.status(200).json({
      ok: true,
      relayer: wallet.address,
      collector: process.env.COLLECTOR
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
