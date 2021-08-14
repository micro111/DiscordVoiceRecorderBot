
const Discord = require('discord.js');
const fs = require("fs");
require("date-utils");

var buf = new Buffer(3840);
buf.fill(0);
const client = new Discord.Client();
const token = 'Your Token ';

const limit=20;
const tout=3000;
var i=0;
var f=0;

var dt = new Date();
var formatted = dt.toFormat("YYYY.MM.DD.HH24MISS");

console.log(formatted+"xxx.wav");

const {Readable}=require('stream');

class Silence extends Readable{
  _read(){this.push(Buffer.from([0xF8,0xFF,0xFE]))}
};

client.on('message',msg=>{
  //if(msg.author.bot||!msg.member.voice.channel)return;
  if(msg.content.match(/online/)){
    msg.channel.send("online").then((m)=>m.delete({ timeout: tout }))
    client.user.setStatus('online').catch ( err => { console.log(err) } );
  }
  if(msg.content.match(/offline/)){
    msg.channel.send("offline").then((m)=>m.delete({ timeout: tout }))
    client.user.setStatus('invisible').catch ( err => { console.log(err) } );
  }

  if(msg.content.match(/join/)){
    let data=[limit];
    i=0;
    f=0;
    var max=0;
    msg.channel.send("邪魔するぜ( ﾟДﾟ)").then(m=>msg.delete({timeout:tout}));
    msg.member.voice.channel.join().then(connect=>{
      connect.play(new Silence,{ type: 'opus' });
      const rec = connect.receiver;
      connect.on('speaking',(u,sp)=>{
        for(i=0;i<max;i++){
          if(max==0||data[i]==u){
            break;
          }
          }
          if(i==max){
            data[i]=u;
            var wf=0;
            const stream=fs.createWriteStream(formatted+u+".pcm");
            const cstream=rec.createStream(u,{ mode: 'pcm', end: 'manual' }).on("data",data=>{
              wf=1;
              stream.write(data);
              if(f==1){
                cstream.destroy(console.log());
                stream.end();
                msg.member.voice.channel.leave();
              }
              while(1){
                  if(wf==0){
                    stream.write(new Silence,{ type: 'pcm' });
                  }else{
                    wf=0;
                  }
              }
            })
            max++;
          }
        })
      })
      }


    if(msg.content.match(/end/)){
      f=1;
    }

    if(msg.content.match(/leave/)){
      msg.channel.send("またの( ﾟДﾟ)").then(m=>msg.delete({timeout:tout}));
      msg.member.voice.channel.leave()
    }
  })

  client.login(token)
