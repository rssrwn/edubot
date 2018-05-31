Blockly.JavaScript['move_forward'] = function(block) {
  var code = 'edubot.moveForward();\nawait sleep(robotTimeStep);\n';
  return code;
};

Blockly.JavaScript['rotate_right'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'edubot.rotateRight();\nawait sleep(robotTimeStep);\n';
  return code;
};

Blockly.JavaScript['rotate_left'] = function(block) {
  var dropdown_angle = block.getFieldValue('angle');
  var code = 'edubot.rotateLeft();\nawait sleep(robotTimeStep);\n';
  return code;
};

Blockly.JavaScript['wall_in_front'] = function(block) {
  var code = 'edubot.blockedByWall()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
