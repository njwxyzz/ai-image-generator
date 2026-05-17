export default async function handler(req, res) {
    // make sure only POST requests are allowed
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { model, promptText } = req.body;
    
    // vercel will automatically load environment variables from a .env file, so we can access our Hugging Face API key like this:
    const apiKey = process.env.HF_API_KEY; 

    try {
        // Send the prompt to Hugging Face and ask for an image back
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: promptText })
        });

        if (!response.ok) {
            throw new Error("Hugging Face tengah sibuk atau error");
        }

        // Hugging Face will send back the generated image as binary data, so we need to convert it to a format we can send back to the frontend
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(Buffer.from(buffer));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}