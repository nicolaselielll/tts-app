const tts = require('@google-cloud/text-to-speech');
const {Storage} = require('@google-cloud/storage');
const path = require('path');

const credentialsPath = path.resolve(__dirname, '..', 'tts-creds.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

require('dotenv').config();

const convertTextToSpeech = async (params) => {
    const ttsLongClient = new tts.TextToSpeechLongAudioSynthesizeClient();

    const audioBucket = 'tts-audio-bucket'
    const outputFileName = `audio_${Date.now()}.wav`;

    const audioURL = `https://storage.cloud.google.com/${audioBucket}/audio/${outputFileName}`

    const longRequest = {
        input: { text: params.text },
        voice: { languageCode: params.lang, ssmlGender: 'NEUTRAL', name: params.voice },
        audioConfig: { audioEncoding: 'LINEAR16' },
        parent: 'projects/tts-app-395420/locations/global',
        outputGcsUri: `gs://${audioBucket}/audio/${outputFileName}`
    };

    await ttsLongClient.synthesizeLongAudio(longRequest);

    return audioURL;
}

module.exports = convertTextToSpeech
