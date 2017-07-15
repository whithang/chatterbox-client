var Chatterbox = function() {
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  this.username = $(document)[0].URL.split('=')[1];
  this.currentMsgs;
};

Chatterbox.prototype.init = function() {
  var context = this;
  $(document).ready(function() {
    $('#submitButton').on('click', function() {
      context.handleSubmit();
    });
    $('#roomSelect').on('click', function() {
      context.renderRoom();
    });
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
    
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', JSON.stringify(data));
    }
  });
};

Chatterbox.prototype.fetch = function(message) {
  $.ajax({
    url: this.server,
    type: 'GET',
    data: JSON.stringify(message),
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: data received: ' + data.responseText);
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
  $child.innerHTML += '<b><br>' + message.username + ': </b><br>' + message.text + 'Room :' 
    + '<br>' + message.roomname + 'Time Posted: ' + message.createdAt;
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
    $('#roomSelect ').append($child);
  }
};

Chatterbox.prototype.handleUsernameClick = function(message) {
};

Chatterbox.prototype.handleSubmit = function(message) {
  var msgObject = {
    username: this.username,
    text: document.getElementById('textBox').value,
    roomname: $('#roomSelect').find(':selected').text()
  };
  this.renderMessage(msgObject);
  this.send(msgObject);
};

var app = new Chatterbox();
app.init();
