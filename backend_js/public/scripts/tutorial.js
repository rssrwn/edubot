var tutorialDiv = document.getElementById("tutorialDiv");
var tutorialText = document.getElementById("tutorialText");
var tutorialRunButton = document.getElementById("simpleRunButton");
var tutorialRestartButton = document.getElementById("simpleRestartButton");
var tutorialHintButton = document.getElementById("simpleHintButton");

var tutorialPhase = 0;

var text = {
  0: "Drag blocks from the left to the workspace",
  1: "Connect blocks together to form programs",
  2: "Press the green triangle to execute your program",
  3: "Press the restart arrow to reset EduBot",
  4: "Click the question mark for a hint"
};

var updateTutorial = function(e) {
  let n = workspace.getAllBlocks().length;
  
  if (n == 0) {
    workspace.options.maxBlocks = 2;
    tutorialPhase = 0;
  }
  if (n == 1) {
    tutorialPhase = 1;
  }
  if (n == 2 && tutorialPhase == 1) {
    let blocks = workspace.getTopBlocks();
    if (blocks.length == 1) {
      tutorialPhase = 2;
    }
  }
  if (tutorialPhase == 5) {
    workspace.options.maxBlocks = 1000;
    // hack to reload workspace
    let xml = Blockly.Xml.workspaceToDom(workspace);
    // let xml_text = Blockly.Xml.domToText(xml);
    // let xml = Blockly.Xml.textToDom(xml_text);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }

  if (text[tutorialPhase] !== undefined) {
    tutorialDiv.style.display = "flex";
    tutorialText.innerText = text[tutorialPhase];
  } else {
    tutorialDiv.style.display = "none";
    tutorialText.innerText = "";
  }
};
workspace.addChangeListener(updateTutorial);

var tutorialRunPressed = function(e) {
  if (tutorialPhase == 2) {
    tutorialPhase = 3;
  }
  updateTutorial();
}
tutorialRunButton.addEventListener("click", tutorialRunPressed);

var tutorialRestartPressed = function(e) {
  if (tutorialPhase == 3) {
    tutorialPhase = 4;
  }
  updateTutorial();
}
tutorialRestartButton.addEventListener("click", tutorialRestartPressed);

var tutorialHintPressed = function(e) {
  if (tutorialPhase == 4) {
    tutorialPhase = 5;
  }
  updateTutorial();
}
tutorialHintButton.addEventListener("click", tutorialHintPressed);

updateTutorial();