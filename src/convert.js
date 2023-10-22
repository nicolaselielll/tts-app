const tts = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

const credentialsPath = path.resolve(__dirname, '..', 'tts-creds.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

require('dotenv').config();

const convertTextToSpeech = async (params) => {
    const ttsLongClient = new tts.TextToSpeechLongAudioSynthesizeClient();
    console.log('LANG', params.lang);

    const longRequest = {
        input: { text: params.text },
        voice: { languageCode: params.lang, ssmlGender: 'NEUTRAL', name: params.voice },
        audioConfig: { audioEncoding: 'LINEAR16' },
        parent: 'projects/tts-app-395420/locations/global',
        outputGcsUri: 'gs://tts-audio-bucket/audio/test.wav'
    };

    console.log('USED THE LONG AUDIO API');
    const [operation] = await ttsLongClient.synthesizeLongAudio(longRequest);
    const [response] = await operation.promise();
    const audioContent = response.audioContent;

    const writeFile = util.promisify(fs.writeFile);
    const outputFileName = `audio_${Date.now()}.wav`;
    const outputPath = path.join('/tmp', outputFileName);
    await writeFile(outputPath, audioContent, 'binary');

    return `${outputFileName}`;
}

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

module.exports = {
    convertTextToSpeech,
    fetchAvailableVoices
}
