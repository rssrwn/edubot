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
    this.appendValueInput("rotate_angle")
        .setCheck(null)
        .appendField("rotate right")
        .appendField(new Blockly.FieldDropdown([["90°","90"], ["180°","180"], ["270°","270"]]), "angle");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Rotate right");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['rotate_left'] = {
  init: function() {
    this.appendValueInput("rotate_angle")
        .setCheck(null)
        .appendField("rotate left")
        .appendField(new Blockly.FieldDropdown([["90°","90"], ["180°","180"], ["270°","270"]]), "angle");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Rotate left");
 this.setHelpUrl("");
  }
};
