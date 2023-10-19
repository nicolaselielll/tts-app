const { convertTextToSpeech } = require('../src/convert');
const cors = require('cors');

const corsMiddleware = cors();

module.exports = async (req, res) => {
    corsMiddleware(req, res, async () => {
        try {
            const text = req.body.text;
            const lang = req.body.lang || 'en-US';
            const voice = req.body.voice;
        
            if (!text) {
                return res.status(400).json({ success: false, message: 'No text provided.' });
            }
        
            const outputFile = await convertTextToSpeech({ 
                text: text, 
                lang: lang,
                voice: voice
            });
        
            res.status(200).json({ 
                success: true, 
                message: 'Text converted successfully.', 
                audioURL: `/output/${outputFile}`
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'An error occurred.' });
        }
    })
};
