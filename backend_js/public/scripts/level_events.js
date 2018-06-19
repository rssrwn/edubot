var blocklyDiv = document.getElementById("blocklyDiv");
var blocklyWorkspaceDiv = document.getElementById("blocklyWorkspaceDiv");
var workspace = Blockly.inject("blocklyWorkspaceDiv",
    {toolbox: document.getElementById("toolbox")});

var highlightedId = null;

var dimmer = document.getElementById("dimmer");
var alertWrapper = document.getElementById("alertWrapperDiv");
var alertTitle = document.getElementById("alertTitle");
var alertText = document.getElementById("alertText");
var alertButton = document.getElementById("alertButton");

var displayAlert = function(title, text, callback) {
  alertTitle.innerText = title;
  alertText.innerHTML = text;
  alertWrapper.style.display = "flex";
  dimmer.style.display = "block";
  alertButton.callback = callback;
}

var closeAlert = function(e) {
  alertWrapper.style.display = "none";
  dimmer.style.display = "none";
  if (alertButton.callback) {
    let callback = alertButton.callback;
    alertButton.callback = null;
    callback();
  }
}
document.getElementById("alertButton").addEventListener("click", closeAlert);

Blockly.BlockSvg.prototype.setHighlighted = function(highlighted) {
  if (!this.rendered) {
    return;
  }
  if (highlighted) {
    this.addSelect();
    this.svgPath_.setAttribute('filter', 'url(#' + this.workspace.options.embossFilterId + ')');
    this.svgPathLight_.style.display = 'none';
  } else {
    this.removeSelect();
    Blockly.utils.removeAttribute(this.svgPath_, 'filter');
    delete this.svgPathLight_.style.display;
  }
};

var highlightBlock = function(id) {
  highlightedId = id;
  workspace.highlightBlock(id);
}

var saveBlocks = function(e) {
  if (e.type !== "ui") {
    let xml = getBlockXML();
    console.log("Save Level ID: " + level.levelId);
    httpPost("https://edubot-learn.herokuapp.com/shared/temp_sol", {level: level.levelId, solution: xml}, function(status) {});
  }
}

var generateCode = function(e) {
  let code = Blockly.JavaScript.workspaceToCode(workspace);
  document.getElementById("code").value = code;
};
workspace.addChangeListener(generateCode);

let runButton = document.getElementById("runButton");
let simpleRunButton = document.getElementById("simpleRunButton");

var runCode = function(e) {
  if (workspace.getAllBlocks().length == 0) {
    return;
  }
  if (Blockly.selected) {
    Blockly.selected.unselect();
  }
  if (true || !runningCommands) {
    runningCommands = true;
    simpleRunButton.style.visibility = "hidden";
    simpleRunButton.style.pointerEvents = "none";

    // Block highlighting
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');

    let our_code = "runningCommands = false;\n \
      if (highlightedId != null) {\n \
        workspace.highlightBlock(highlightedId, false);\n \
      }";

    let code = Blockly.JavaScript.workspaceToCode(workspace);
    code = "async function evalCode() {" + code + our_code + "}; evalCode();";

    eval(code);
  }
};

runButton.addEventListener("click", runCode);
simpleRunButton.addEventListener("click", runCode);

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
  simpleRunButton.style.visibility = "visible";
  simpleRunButton.style.pointerEvents = "auto";
  if (highlightedId != null) {
    workspace.highlightBlock(highlightedId, false);
  }
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
