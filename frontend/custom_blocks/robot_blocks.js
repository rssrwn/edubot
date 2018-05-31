Blockly.Blocks['move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("move forward");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Move robot forward");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rotate_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rotate right");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Rotate right");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rotate_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rotate left");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Rotate left");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['wall_in_front'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wall in front");
    this.setOutput(true, "Boolean");
    this.setColour(230);
 this.setTooltip("True if a wall is in front of EduBot");
 this.setHelpUrl("");
  }
};
