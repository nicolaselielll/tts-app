const { convertTextToSpeech } = require('../../src/convert');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const corsMiddleware = cors();

module.exports = async (req, res) => {
    corsMiddleware(req, res, async (err) => {
        if (err) return res.status(500).send(err);
        var body = JSON.parse(req.body)
        console.log('BODY', body)
        try {
            const text = body.text;
            const lang = body.lang || 'en-US';
            const voice = body.voice;

            console.log('TEXT', text)

            if (!text) {
                return res.status(400).json({ success: false, message: 'No text provided.' });
            }

            const outputFile = await convertTextToSpeech({ 
                text: text, 
                lang: lang,
                voice: voice
            });

            const audioPath = path.join('/tmp', outputFile);
            const audioData = fs.readFileSync(audioPath);
            console.log('OUTPUT', outputFile)
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioData);

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'An error occurred.' });
        }
    });
}
