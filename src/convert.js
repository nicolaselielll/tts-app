const path = require('path');
const AWS = require('aws-sdk');

const convertTextToSpeech = async (params) => {

    // Configure AWS with your access and secret key.
    // It's recommended to set these environment variables in your environment or use IAM roles.
    AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: 'eu-central-1'  // For example, set your region
    });

    const polly = new AWS.Polly();

    let params = {
        'Text': 'Hello from Amazon Polly!',
        'OutputFormat': 'mp3',
        'VoiceId': 'Joanna'
    };

    polly.synthesizeSpeech(params, (err, data) => {
        if (err) {
            console.log(err.code);
        } else if (data) {
            if (data.AudioStream instanceof Buffer) {
                // Save the synthesized speech to a file
                require('fs').writeFile('speech.mp3', data.AudioStream, (err) => {
                    if (err) {
                        return console.log(err)
                    }
                    console.log("The file was saved!")
                });
            }
        }
    });
}

module.exports = convertTextToSpeech
