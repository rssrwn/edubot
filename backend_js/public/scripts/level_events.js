var blocklyDiv = document.getElementById("blocklyDiv");
var blocklyWorkspaceDiv = document.getElementById("blocklyWorkspaceDiv");
var workspace = Blockly.inject("blocklyWorkspaceDiv",
    {toolbox: document.getElementById("toolbox")});

var generateCode = function(e) {
  let code = Blockly.JavaScript.workspaceToCode(workspace);
  document.getElementById("code").value = code;
};
workspace.addChangeListener(generateCode);

var runCode = function(e) {
  if (!runningCommands) {
    let code = document.getElementById("code").value;
    code = "async function evalCode() {" + code + "}; evalCode();";
    eval(code);
    executeCommands();
  }
};
let runButton = document.getElementById("runButton");
runButton.addEventListener("click", runCode);
let simpleRunButton = document.getElementById("simpleRunButton");
runButton.addEventListener("click", runCode);

var viewCode = function(e) {
  let codeView = document.getElementById("codeDiv");
  if (codeView.style.display === "none") {
    codeView.style.display = "block";
  } else {
    codeView.style.display = "none";
  }
  onResize();
};
document.getElementById("codeDiv").style.display = "none";
let viewButton = document.getElementById("viewButton");
viewButton.addEventListener("click", viewCode);

function showHint(e) {
  level.showHint();
}

document.getElementById("hintButton").addEventListener("click", showHint);
document.getElementById("simpleHintButton").addEventListener("click", showHint);

function restart(e) {
  restartLevel();
}

document.getElementById("restartButton").addEventListener("click", restart);
document.getElementById("simpleRestartButton").addEventListener("click", restart);

var blocklyResize = function(e) {
  let element = blocklyDiv;
  let x = 0;
  let y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element !== null);
  blocklyWorkspaceDiv.style.left = x + "px";
  blocklyWorkspaceDiv.style.top = y + "px";
  blocklyWorkspaceDiv.style.width = blocklyDiv.offsetWidth + "px";
  blocklyWorkspaceDiv.style.height = blocklyDiv.offsetHeight + "px";
  Blockly.svgResize(workspace);
};

var canvasResize = function(e) {
  let canvasPaddingDiv = document.getElementById("canvasPaddingDiv");
  let gameCanvas = document.getElementById("game_canvas");

  let size = Math.min(canvasPaddingDiv.offsetWidth, canvasPaddingDiv.offsetHeight);
  gameCanvas.style.width = size + "px";
  gameCanvas.style.height = size + "px";
};

var onResize = function(e) {
  canvasResize(e);
  blocklyResize(e);
};
window.addEventListener("resize", onResize, false);
onResize();

var getBlockXML = function() {
  var xml = Blockly.Xml.workspaceToDom(workspace);
  return Blockly.Xml.domToText(xml);
};

var putBlockXML = function(xml_text) {
  var xml = Blockly.Xml.textToDom(xml_text);
  Blockly.Xml.domToWorkspace(xml, workspace);
};