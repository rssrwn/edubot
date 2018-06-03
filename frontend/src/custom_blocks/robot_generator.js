var executionTimeoutId = null;

function setExecutionTimeoutId(id) {
  executionTimeoutId = id;
}

Blockly.JavaScript['move_forward'] = function(block) {
  var code = 'getRobot().moveForward();\nawait sleep(robotStepTime, ' +
    'setExecutionTimeoutId);\n';
  return code;
};

Blockly.JavaScript['rotate_right'] = function(block) {
  var code = 'getRobot().rotateRight();\nawait sleep(robotStepTime,' +
     'setExecutionTimeoutId);\n';
  return code;
};

Blockly.JavaScript['rotate_left'] = function(block) {
  var code = 'getRobot().rotateLeft();\nawait sleep(robotStepTime, setExecutionTimeoutId);\n';
  return code;
};

Blockly.JavaScript['wall_in_front'] = function(block) {
  var code = 'getRobot().blockedByWall()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
