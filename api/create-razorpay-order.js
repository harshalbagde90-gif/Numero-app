export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, currency } = req.body;
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        if (!keyId || !keySecret) {
            console.error('Razorpay keys missing in environment');
            return res.status(500).json({ error: 'Razorpay keys not configured' });
        }

        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100), // paise
                currency: currency || "INR",
                receipt: `receipt_${Date.now()}`,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }

        const order = await response.json();
        return res.status(200).json({
            order_id: order.id,
            key_id: keyId,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
