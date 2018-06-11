var tutorialPhase = 0;
var tutorialDiv = document.getElementById("tutorialDiv");

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
  if (tutorialPhase == 0) {
    tutorialDiv.style.display = "block";
  } else {
    tutorialDiv.style.display = "none";
  }
};
workspace.addChangeListener(workspaceChange);