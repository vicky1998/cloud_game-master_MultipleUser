'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;

var colors = [
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];





function connect(event) {
  username = "Cloud Gaming";
  if (username) {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    usernamePage.classList.add('hidden');
    chatPage.classList.remove('hidden');
    stompClient.connect({}, onConnected, onError);
  }
  event.preventDefault();
}


function onConnected() {
  stompClient.subscribe('/topic/public', onMessageReceived);
  stompClient.send("/app/chat.addUser",
    {},
    JSON.stringify({sender: username, type: 'JOIN'})
  );
  // connectingElement.classList.add('hidden');
}


function onError(error) {
  connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
  connectingElement.style.color = 'red';
}


function sendMessage(event) {
  var messageContent = messageInput.value.trim();

  if (messageContent && stompClient) {
    var chatMessage = {
      sender: username,
      content: messageInput.value,
      type: 'CHAT'
    };

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
//    messageInput.value = '';
  }
  event.preventDefault();
}


function onMessageReceived(payload) {
  var message = JSON.parse(payload.body);
  console.log("Message..from server", message)
//  var dir_x=message.dx;
//  var dir_y=message.dy;
//   console.log("hii dx = ", dir_x,"  hiii dy = ",dir_y)
//if(message.content==="")

  //snake.dx = -grid;
  //snake.dy = 0;






 // alert("Message received..")
  // var messageElement = document.createElement('li');
  //
  // if (message.type === 'JOIN') {
  //   messageElement.classList.add('event-message');
  //   message.content = message.sender + ' joined!';
  // } else if (message.type === 'LEAVE') {
  //   messageElement.classList.add('event-message');
  //   message.content = message.sender + ' left!';
  // } else {
  //   messageElement.classList.add('chat-message');
  //
  //   var avatarElement = document.createElement('i');
  //   var avatarText = document.createTextNode(message.sender[0]);
  //   avatarElement.appendChild(avatarText);
  //   avatarElement.style['background-color'] = getAvatarColor(message.sender);
  //
  //   messageElement.appendChild(avatarElement);
  //
  //   var usernameElement = document.createElement('span');
  //   var usernameText = document.createTextNode(message.sender);
  //   usernameElement.appendChild(usernameText);
  //   messageElement.appendChild(usernameElement);
// }

// var textElement = document.createElement('p');
// var messageText = document.createTextNode(message.content);
// textElement.appendChild(messageText);
//
// messageElement.appendChild(textElement);
//
// messageArea.appendChild(messageElement);
// messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
  var hash = 0;
  for (var i = 0; i < messageSender.length; i++) {
    hash = 31 * hash + messageSender.charCodeAt(i);
  }

  var index = Math.abs(hash % colors.length);
  return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
// messageForm.addEventListener('submit', sendMessage, true)


// alert("game started");
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;







var snake = {
  x: 160,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating an apple
  maxCells: 4
};










var apple = {
  x: 320,
  y: 320
};
// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function (cell, index) {

    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key

  if (e.which === 37 && snake.dx === 0) {
  snake.dx = -grid;
   snake.dy = 0;
    var messageContent = "left arrow";
    if(messageContent && stompClient) {
            var chatMessage = {
                sender: username,
                content: "e.which === 37 && snake.dx === 0",
                dx: 37,
                dy: 0,
                type: 'CHAT'
            };

            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            messageInput.value = 'left';
        }
        event.preventDefault();
    //alert("left arrow");
  }
  // up arrow key

  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
      var messageContent = "up arrow";
        if(messageContent && stompClient) {
                var chatMessage = {
                    sender: username,
                    content: "Up Arrow",
                    type: 'CHAT'
                };

                stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                messageInput.value = '';
            }
            event.preventDefault();
  //  alert("up arrow");
  }
  // right arrow key

  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;

      var messageContent = "right arrow";
        if(messageContent && stompClient) {
                var chatMessage = {
                    sender: username,
                    content: "right arrow",
                    type: 'CHAT'
                };

                stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                messageInput.value = '';
            }
            event.preventDefault();

   // alert("right arrow");
  }
  // down arrow key

  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;

      var messageContent = "Down arrow";
        if(messageContent && stompClient) {
                var chatMessage = {
                    sender: username,
                    content: "Down Arrow",
                    type: 'CHAT'
                };

                stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                messageInput.value = '';
            }
            event.preventDefault();
    //alert("down arrow");
  }
});
// start the game
requestAnimationFrame(loop);