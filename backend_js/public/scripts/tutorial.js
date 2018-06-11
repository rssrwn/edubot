var tutorialPhase = 0;
var tutorialDiv = document.getElementById("tutorialDiv");
var tutorialDiv = document.getElementById("tutorialText");

var text = {
  0: "Phase 0",
  1: "Phase 1"
};

var workspaceChange = function(e) {
  let n = workspace.getAllBlocks().length;
  if (tutorialPhase === 0 && n === 1) {
    // Dragging block
    tutorialPhase = 1;
  } else if (tutorialPhase === 1 && n === 1) {
    // Dropped block on workspace
    tutorialPhase = 2;
  } else if (tutorialPhase === 0 && n === 1) {
    // Placed block back down
    tutorialPhase = 0;
  }
  if (text[tutorialPhase] !== undefined) {
    tutorialDiv.style.display = "block";
    tutorialText.innerHtml = text[tutorialPhase];
  } else {
    tutorialDiv.style.display = "none";
    tutorialText.innerHtml = "";
  }
};
workspace.addChangeListener(workspaceChange);