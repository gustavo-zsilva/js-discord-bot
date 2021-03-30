const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const { prefix, token } = require('../config.json');

const client = new Discord.Client();

// let defaultChannel = '825376978063458324';

client.once('ready', () => {
    console.log('Ready!');
    
    client.channels.cache.map(channel => {
        console.log(`${channel.name} => ${channel.id}`)
    })
})

client.once('disconnect', () => {
    console.log('Disconnect!');
})

// client.on('message', (msg) => {
//     if (msg.author.bot) return;

//     const args = msg.content.split(' ');

//     if (`${prefix}setRockChannel`) {
//         defaultChannel = args[1];
//         msg.channel.send(`Canal do rock agora é ${defaultChannel}`)
//     }
// })

async function play(newMember) {

    const songInfo = await ytdl.getInfo('https://youtu.be/6FcpPMdH9UM');
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    }

    const voiceChannel = newMember.channel;
    const connection = await voiceChannel.join();
    
    const dispatcher = connection.play(ytdl(song.url));
    dispatcher.on('finish', (finish) => play(newMember));
}

let hasMemberOnChannel = false;

client.on('voiceStateUpdate', async (oldMember, newMember) => {
    let newUserChannel = newMember.channel;

    if (newUserChannel === undefined) {
        newMember.channel.leave();
        hasMemberOnChannel = false;

        return;
    }

    try {
        if (newMember.channelID != '825376978063458324') return;
        if (hasMemberOnChannel) return;
        
        play(newMember);
        hasMemberOnChannel = true;
    } catch (err) {
        console.error(err);
    }

})

client.login(token);