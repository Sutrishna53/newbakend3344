export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    relayer: process.env.RELAYER_ADDRESS,
    collector: process.env.COLLECTOR_ADDRESS
  });
}
