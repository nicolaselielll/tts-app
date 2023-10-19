const { fetchAvailableVoices } = require('../src/convert');

module.exports = async (req, res) => {
  try {
    const languageCode = req.query.lang;
    const voices = await fetchAvailableVoices(languageCode);
    res.status(200).json(voices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred fetching voices.' });
  }
};
