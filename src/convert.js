const tts = require('@google-cloud/text-to-speech');
const {Storage} = require('@google-cloud/storage');
const path = require('path');

const ttsLongClient = new tts.TextToSpeechLongAudioSynthesizeClient();
const storage = new Storage();

const credentialsPath = path.resolve(__dirname, '..', 'tts-creds.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

require('dotenv').config();

const convertTextToSpeech = async (params) => {
    const outputFileName = `audio_${Date.now()}.wav`;

    const longRequest = {
        input: { text: params.text },
        voice: { languageCode: params.lang, ssmlGender: 'NEUTRAL', name: params.voice },
        audioConfig: { audioEncoding: 'LINEAR16' },
        parent: 'projects/tts-app-395420/locations/global',
        outputGcsUri: `gs://tts-audio-bucket/audio/${outputFileName}`
    };

    const [operation] = await ttsLongClient.synthesizeLongAudio(longRequest);
    const [response] = await operation.promise();

    // Fetch the audio from GCS
    const bucket = storage.bucket('tts-audio-bucket');
    const file = bucket.file(fileLocation);
    const [audioContent] = await file.download();

    console.log('AUDIO CONTENT', audioContent)

    return audioContent;
}

module.exports = convertTextToSpeech
