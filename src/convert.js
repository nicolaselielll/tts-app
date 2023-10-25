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

    await ttsLongClient.synthesizeLongAudio(longRequest);

    // Instead of writing the file to /tmp, generate a signed URL for the file in the bucket
    const signedUrl = await generateSignedUrl('tts-audio-bucket', `audio/${outputFileName}`);
    
    return signedUrl; // This now returns the signed URL which can be accessed directly by the client
}

const generateSignedUrl = async (bucketName, fileName) => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    // These options will allow temporary read access to the file
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 60 minutes
    };

    // Get a signed URL for the file
    const [signedUrl] = await file.getSignedUrl(options);

    return signedUrl;
}

module.exports = convertTextToSpeech
