var Chatterbox = function() {
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  this.username = $(document)[0].URL.split('=')[1];
};

Chatterbox.prototype.init = function() {
  var context = this;
  $(document).ready(function() {
    $('#submitButton').on('click', function(){context.renderMessage(document.getElementById('textBox').value);});
    $('#roomSelect').on('click', context.renderRoom);
  });
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
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

Chatterbox.prototype.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    data: JSON.stringify(message),
    dataType: 'json',
    success: function (data) {
      console.log('chatterbox: data received: ' + data.responseText);
    },
    error: function (data) {
      console.error('chatterbox: Failed: data not received', data);
    }
  });
  
};

Chatterbox.prototype.clearMessages = function() {
  // var allMessages = this.fetch();
  // $.ajax({
  //   url: this.server,
  //   type: 'DELETE',
  //   data: allMessages,
  //   contentType: 'application/json',
  //   success: function (data) {
  //     console.log('chatterbox: Messages deleted');
  //   },
  //   error: function (data) {
  //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //     console.error('chatterbox: Failed to delete message', data);
  //   }
  // });
  $('#chats').html('');
};

Chatterbox.prototype.renderMessage = function(message) {
  var $child = document.createElement('div');
  var value = message;
  $child.innerHTML += '<b><br>' + this.username  + ': </b><br>' + value;
  $('#chats').prepend($child);

  var msgObject = {
    username: this.username,
    text: message,
    roomname: $('#roomSelect').find(':selected').text()
  };
  this.send(msgObject);
};

Chatterbox.prototype.renderRoom = function(roomName) {
  var $child = document.createElement('option');
  var value = roomName;
  $child.innerHTML += value;
  $child.value = roomName;
  $('#roomSelect ').append($child);
};

var app = new Chatterbox();
app.init();
