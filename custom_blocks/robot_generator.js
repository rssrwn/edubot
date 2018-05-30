Blockly.JavaScript['move_forward'] = function(block) {
  var code = 'Robot.MoveForward();\n';
  return code;
};

Blockly.JavaScript['rotate_right'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'Robot.RotateRight(' + dropdown_angle + ');\n';
  return code;
};

Blockly.JavaScript['rotate_left'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'Robot.RotateLeft(' + dropdown_angle + ');\n';
  return code;
};
