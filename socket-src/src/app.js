const express = require('express');
const http = require('http')
const WebSocket = require('ws');
const url = require('url');
const { userTable } = require('./database');
const request = require("request");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
  ws.on('message', async (message) => {

    const array = ['help', 'showUsers', 'humm'];
    packet = JSON.parse(message);

    if(array.indexOf(packet.type) == -1){
      ws.send(JSON.stringify({message: 'The options you provided doesnt exists in the options we have'}));
    }

    if(packet.type == 'help'){
      ws.send(JSON.stringify({message: 'Check the correct options from the source code that you have :)'}));
    }
    
    if(packet.type == 'showUsers'){
      const sql = `SELECT name FROM user`;
      const param = [];

      userTable.all(sql, param, (err, rows) => {
        if(err){
          return ws.send("something went wrong");
        }
        ws.send(JSON.stringify(rows));
      });
    }

    if(packet.type == 'humm'){
      try {                                                                                                                                                  
        request(packet.param).on('error', function(err) {
          ws.send(JSON.stringify(err))
        }).on('response', function(response) {
          let result = []
          response.on('data', function (chunk) { result.push(chunk) })
          response.on('end', function () { 
            try {
              ws.send(JSON.stringify({content: `data:;base64,${Buffer.concat(result).toString('base64')}`}))
            } catch(err) { ws.send(JSON.stringify(err)) }
          })
        })
      } catch(err) { ws.send(JSON.stringify(err)) }
    }
  });
});

server.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === '/mysocket') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(80, () => {
	console.log('listening on port 80');
});
