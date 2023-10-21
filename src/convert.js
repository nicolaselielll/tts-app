const tts = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

const credentialsPath = path.resolve(__dirname, '..', 'tts-creds.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

require('dotenv').config();

const deletePreviousAudioFiles = async () => {
    const outputDir = '/tmp';
    const files = fs.readdirSync(outputDir);
    files.forEach(file => {
        if (path.extname(file) === '.mp3') {
            fs.unlinkSync(path.join(outputDir, file));
        }
    });
}

const convertTextToSpeech = async (params) => {
    const client = new tts.TextToSpeechClient();
    console.log('LANG', params.lang);

    const request = {
        input: { text: JSON.stringify(params.text) },
        voice: { languageCode: params.lang, ssmlGender: 'NEUTRAL', name: params.voice },
        audioConfig: { audioEncoding: 'MP3' },
        effectsProfileId: ["small-bluetooth-speaker-class-device"],
    };

    let audioContent;
    if (Buffer.from(JSON.stringify(params.text)).length > 5000) {
        console.log('USED THE LONG AUDIO API')
        // Use longrunningsynthesize for texts exceeding 5000 bytes
        const [operation] = await client.longrunningsynthesize(request);
        const [response] = await operation.promise();
        audioContent = response.audioContent;
    } else {
        console.log('USED THE SHORT AUDIO API')
        const [response] = await client.synthesizeSpeech(request);
        audioContent = response.audioContent;
    }

    // Delete any existing audio files before writing a new one
    await deletePreviousAudioFiles();

    const writeFile = util.promisify(fs.writeFile);
    const outputFileName = `audio_${Date.now()}.mp3`;
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
