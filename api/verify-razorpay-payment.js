import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keySecret) {
            return res.status(500).json({ error: 'Razorpay secret not configured in Vercel' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            return res.status(200).json({ verified: true });
        } else {
            return res.status(400).json({ verified: false, error: "Invalid signature" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
