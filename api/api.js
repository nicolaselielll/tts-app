const express = require('express');
const cors = require('cors');
const { convertTextToSpeech, fetchAvailableVoices } = require('../src/convert');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post('/api/convert', async (req, res) => {
  try {
    const text = req.body.text;
    const lang = req.body.lang || 'en-US';
    const voice = req.body.voice

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
      audioURL: `http://localhost:3001/output/${outputFile}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
});

app.get('/api/voices', async (req, res) => {
  try {
      const languageCode = req.query.lang;
      const voices = await fetchAvailableVoices(languageCode);
      res.status(200).json(voices);
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred fetching voices.' });
  }
});

app.use('/output', express.static('./output'));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
