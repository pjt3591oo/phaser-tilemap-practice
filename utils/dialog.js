function showDialog(self, msg, buttonMsg, cb) {
  const dialog = self.rexUI.add.dialog({
    x: 400,
    y: 300,
    width: 500,

    background: self.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

    title: createLabel(self, 'Room').setDraggable(),

    content: createLabel(self, msg),

    actions: [
      createLabel(self, buttonMsg)
    ],

    space: {
      left: 20,
      right: 20,
      top: -20,
      bottom: -20,

      title: 25,
      titleLeft: 30,
      content: 25,
      description: 25,
      descriptionLeft: 20,
      descriptionRight: 20,
      choices: 25,

      toolbarItem: 5,
      choice: 15,
      action: 15,
    },

    expand: {
      title: false,
    },

    align: {
      title: 'center',
      actions: 'right', // 'center'|'left'|'right'
    },

    click: {
      mode: 'release'
    }
  })
    .setDraggable('background')   // Draggable-background
    .layout()
    .setScrollFactor(0)
    .popUp(500);

  console.log(msg, buttonMsg);
  self.print = self.add.text(0, 0, msg);

  dialog
    .on('button.click', function (button, groupName, index, pointer, event) {
      // self.print.text += groupName + '-' + index + ': ' + button.text + '\n';
      console.log('clicked')
      // dialog.hide();
      // console.log(dialog);
      // TODO: visible을 이용해서 dialog를 보이지 않게 하는 방법이 올바른 방법인가?
      dialog.visible = false;
      cb();
    }, self)
    .on('button.over', function (button, groupName, index, pointer, event) {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', function (button, groupName, index, pointer, event) {
      button.getElement('background').setStrokeStyle();
    });
}

function createLabel(scene, text) {
  return scene.rexUI.add.label({
    width: 40, // Minimum width of round-rectangle
    height: 40, // Minimum height of round-rectangle

    background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

    text: scene.add.text(0, 0, text, {
      fontSize: '24px'
    }),

    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  });
}