Blockly.JavaScript['move_forward'] = function(block) {
  var code = 'addCommand(new MoveCommand());\n';
  return code;
};

Blockly.JavaScript['rotate_right'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'addCommand(new RotateRightCommand());\n';
  return code;
};

Blockly.JavaScript['rotate_left'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'addCommand(new RotateLeftCommand());\n';
  return code;
};

Blockly.JavaScript['wall_in_front'] = function(block) {
  var code = 'isWallInFront()\n';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
