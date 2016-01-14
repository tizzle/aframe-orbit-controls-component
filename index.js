var keyboardComponent = {
  schema: {
    default: 'abcdefghijklmnopqrstuvwxyz'
  },

  update: function () {
    var characters = this.data.split('');
    var keyboard = this.el;
    var self = this;
    var selectedLetterIndex = 0;

    // Create letters that, when clicked, trigger a `keydown` event on the keyboard.
    characters.forEach(function (character) {
      // Keyboard characters absorb text properties of the keyboard.
      var textProperties = keyboard.getAttribute('text') || {};
      textProperties.text = character;

      var entity = document.createElement('a-entity');
      entity.setAttribute('text', textProperties);
      entity.addEventListener('click', function () {
        keyboard.emit('keydown', {
          character: character
        });
      });
      keyboard.appendChild(entity);
    });
  }
};

var keyboardOutputComponent = {
  schema: {
    type: 'selector'
  },

  update: function () {
    var keyboard = this.data;
    var keyboardOutput = this.el;

    // When keyboard enters a key, output the character as a child.
    keyboard.addEventListener('keydown', function (event) {
      // Outputted character absorbs text properties of the keyboard output wrapper or
      // the keyboard.
      var textProperties = keyboardOutput.getAttribute('text') ||
                           keyboard.getAttribute('text');
      textProperties.text = event.character;

      var entity = document.createElement('a-entity');
      entity.setAttribute('text', textProperties);

      keyboardOutput.appendChild(entity);
    });
  }
};

module.exports.components = {
  'keyboard': keyboardComponent,
  'keyboard-output': keyboardOutputComponent
};
