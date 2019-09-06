const WebSocket = require('ws')
const fetch = require('node-fetch');

const wss = new WebSocket.Server({ port: 8080 })

function saveMessage(url, data) {
  return fetch(url, {
      method: 'POST',
      body:    JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
  });
}

function postMessage(ws, data) {
  ws.send(JSON.stringify({
    type: 'message',
    ...data
  }));
}



function createThread(ws, url, { friendId, message }) {
  return fetch(url, {
      method: 'POST',
      body:    JSON.stringify({ friendId: friendId }),
      headers: { 'Content-Type': 'application/json' }
  }).then((response) => {
    return response.json();
  }).then(({ id }) => {
    return saveMessage(`http://localhost:3000/chats/${id}/messages`, { text: message }).then(() => {
      return { id, text: message };
    });
  }).then(({ id }) => {
    return saveMessage(`http://localhost:3000/chats/${id}/messages`, { text: message, is_received: true }).then(() => {
      return { id, text: message };
    });
  }).then((data) => {
    postMessage(ws, { message: data.text, is_new_thread: true, id: data.id });
  });
}

wss.on('connection', ws => {
  ws.on('message', response => {
    let { url, action, type, message: text, friendId } = JSON.parse(response)
    if (action === 'add_new_message') {
      saveMessage(url, { type, text })
      .then(res => res.json())
      .then(json => {
        console.log(`Received message => ${text}`)
        return saveMessage(url, { text, is_received: true }).then(() => {
          postMessage(ws, { message: text });
        });
      });
    } else if (action === 'add_new_thread') {
      createThread(ws, url, { friendId, message: text })
    }
  });
})
