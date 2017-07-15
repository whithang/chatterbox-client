var Chatterbox = function() {
  this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
  //this.init.bind(this);
};

Chatterbox.prototype.init = function() {
  var context = this;
  $(document).ready(function() {
    $('#submitButton').on('click', context.send);
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
      this.renderMessage(message);
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
  var allMessages = this.fetch();
  $.ajax({
    url: this.server,
    type: 'DELETE',
    data: allMessages,
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Messages deleted');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to delete message', data);
    }
  });
};

Chatterbox.prototype.renderMessage = function(message) {
  var $child = document.createElement('span');
  var value = message.text;
  $child.innerHTML += value;
  $('#chats').prepend($child);
};

Chatterbox.prototype.renderRoom = function() {
};

var app = new Chatterbox();
app.init();
