const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { videoToken, MyvideoToken } = require('./tokens');
require('dotenv').config();

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_AUTH_TOKEN
);


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);

});
app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/gettoken', (req, res) => {
  const identity = req.body.identity;

  const token = MyvideoToken(identity, config);
  sendTokenResponse(token, res);
});

app.post('/video/completeevent', async (req, res) => {
  const room = req.body.room;

  let existingRooms = await client.video.rooms.list({uniqueName: room})
  if (existingRooms.length > 0) {
    // Let's update the room status to complete
    console.log('Room existing. Set to complete')
    await client.video.rooms(existingRooms[0].sid).update({status: 'completed'});
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ Room: `Room compeleted ${room}!` }));
});

app.get('/video/participants', async (req, res) => {
    const room = req.query.room;
  let participants = await client.video.rooms(room).participants.list({status: 'connected'});
 
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ participants: participants }));
});

app.post('/video/disconnect', async (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;

let ret = await client.video.rooms(room).participants(identity).update({status: 'disconnected'});

res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify({ participants: ret }));
});

app.post('/video/createroom', async (req, res) => {
   const identity = req.body.identity;
   const room = req.body.room;
  let newRoom;
   let existingRooms = await client.video.rooms.list({uniqueName: room})
  if (existingRooms.length > 0) {
    // Let's update the room status to complete
    //console.log('Room existing. Set to complete')
    //await client.video.rooms(existingRooms[0].sid).update({status: 'completed'})

    //fetch instance of existing room
    console.log('Room existing. Get existing room')
    newRoom = await client.video.rooms(existingRooms[0].sid).fetch({uniqueName: room.uniqueName});
    console.log(newRoom.uniqueName);
  }
  else{

   newRoom =  await client.video.rooms.create({
    type: 'peertopeer',
    uniqueName: room
  })
}
});

// app.post('/video/notify', async (req, res) => {
//   console.log(req.body.room);
//   const identity = req.body.identity;
//    const room = req.body.room;
//    const sid = req.body.sid;

//    const service = await client.notify.services.create();

//    const notification = await client.notify.services(service.sid).notifications.create({body:'hello', identity:[identity]});
//    res.setHeader('Content-Type', 'application/json');
//    res.send(JSON.stringify({ notification: notification.sid }));
// });






app.listen(3001, () => {
  console.log('Express server is running on localhost:3001')
  console.log('atuja' + process.env.TWILIO_ACCOUNT_SID);
}
  
);
