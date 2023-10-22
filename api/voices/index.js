const fetchAvailableVoices = require('../../src/voices');
const cors = require('cors');

const corsMiddleware = cors();

module.exports = async (req, res) => {
    corsMiddleware(req, res, async (err) => {
        if (err) return res.status(500).send(err);
        try {
            const languageCode = req.query.lang;
            const voices = await fetchAvailableVoices(languageCode);
            res.status(200).json(voices);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'An error occurred fetching voices.' });
        }
    });
}
