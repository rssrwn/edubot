Blockly.JavaScript['move_forward'] = function(block) {
  var code = 'edubot.moveForward();\n';
  return code;
};

Blockly.JavaScript['rotate_right'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'edubot.rotateRight(' + ');\n';
  return code;
};

Blockly.JavaScript['rotate_left'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'edubot.rotateLeft(' + ');\n';
  return code;
};
