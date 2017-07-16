var Chatterbox = function() {
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  this.username = $(document)[0].URL.split('=')[1];
  this.currentMsgs;
  this.friends = [];
  this.currentRoom;
};

Chatterbox.prototype.init = function() {
  var context = this;
  $(document).ready(function() {
    //$('#send').on('click'), app.handleSubmit;
    $('main').on('click'), app.handleUsernameClick();
    $('#send').on('click', function() {
      context.handleSubmit();
    });
    $('#roomSelect').on('click', function() {
      context.renderRoom();
    });
    $('#roomSelect').on('change', function() {
      context.addRoom();
    });
    // $('#chats a').on('click', function() {
    //   context.handleUsernameClick(this.value);
    // });
  });
  this.fetch();
};

Chatterbox.prototype.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', JSON.stringify(data));
    }
  });
};

Chatterbox.prototype.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    data: {
      order: '-createdAt',
      limit: 100,
      include: {'roomname': 'Create a New Room'}
    },
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: data received: ');
      window.app.currentMsgs = data.results;
      window.app.renderAllMessages();
    },
    error: function (data) {
      console.error('chatterbox: Failed: data not received', data);
    }
  });
};

Chatterbox.prototype.clearMessages = function() {
  $('#chats').html('');
};

Chatterbox.prototype.renderMessage = function(message) {
  var $child = document.createElement('div');

  var username = message.username;
  if (username !== undefined) {
    if (username.includes('-') || username.includes('<') || username.includes('>') || username.includes('&') || username.includes('"')) {
      username = 'invalid name';
    } else {
      if (app.friends.includes(message.username)) {
        username = '<b>' + username + '</b>';
      }
    }
  }

  var messageText = message.text;
  if (messageText !== undefined) {
    if (messageText.includes('-') || messageText.includes('<') || messageText.includes('>') || messageText.includes('&') || messageText.includes('"')) {
      messageText = 'invalid message';
    }
  }
  
  $child.innerHTML += '<br><a onClick="app.handleUsernameClick(this.innerText)" href="#">' + username + ': </a>' + '<br>' + messageText + '<br>' + 'Room: ' + message.roomname + '<br>Time Posted: ' + message.createdAt;
  $('#chats').prepend($child);
};

Chatterbox.prototype.renderAllMessages = function() {
  if (this.currentMsgs !== undefined) {
    for (var i = 0; i < this.currentMsgs.length; i++) {
      this.renderMessage(this.currentMsgs[i]);
    }
  }
};


Chatterbox.prototype.renderRoom = function(roomName) {
  if (roomName !== undefined) {
    var $child = document.createElement('option');
    var value = roomName;
    $child.innerHTML += value;
    $child.value = roomName;
    $('#roomSelect').append($child);
  }
  //$('#roomSelect').find(this.currentRoom);
  // $('#roomSelect').find('option')[$('#roomSelect').find('option').length - 1].value
  // how to update the selector parameter of the room?
  //fetch for only this room of messages
  $('#roomSelect').val(roomName);
};

Chatterbox.prototype.addRoom = function() {
  if ($(roomSelect).context.value === 'Create a New Room') {
    var roomName = prompt('Enter a new chat room name', 'Create a New Chat Room');
  }
  this.currentRoom = roomName;
  this.renderRoom(roomName);
};

Chatterbox.prototype.handleUsernameClick = function(friendName) {
  if (friendName !== undefined) {
    if (!this.friends.includes(friendName)) {
      this.friends.push(friendName);
    }
  }
};

Chatterbox.prototype.handleSubmit = function(message) {
  var msgObject = {
    username: this.username,
    text: document.getElementById('message').value,
    roomname: $('#roomSelect').find(':selected').text(),
  };
  this.renderMessage(msgObject);
  this.send(msgObject);
};

var app = new Chatterbox();
app.init();
