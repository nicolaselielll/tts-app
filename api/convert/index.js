const { convertTextToSpeech } = require('../../src/convert.js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const corsMiddleware = cors();

module.exports = async (req, res) => {
    corsMiddleware(req, res, async (err) => {
        if (err) return res.status(500).send(err);
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

            const audioPath = path.join('/tmp', outputFile);
            const audioData = fs.readFileSync(audioPath);
            console.log('OUTPUT FILE', outputFile)
            res.setHeader('Content-Type', 'audio/mpeg');
            res.send(audioData);

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'An error occurred.' });
        }
    });
};