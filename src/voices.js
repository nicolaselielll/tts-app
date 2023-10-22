const tts = require('@google-cloud/text-to-speech');
const path = require('path');

const credentialsPath = path.resolve(__dirname, '..', 'tts-creds.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const fetchAvailableVoices = async (languageCode) => {
    const client = new tts.TextToSpeechClient();
    const [response] = await client.listVoices({languageCode});

    const voices = response.voices.map(voice => ({
        name: voice.name,
        gender: voice.ssmlGender,
        language: voice.languageCodes[0],
    }));

    return voices;
}

module.exports = fetchAvailableVoices