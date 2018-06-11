var tutorialDiv = document.getElementById("tutorialDiv");
var tutorialDiv = document.getElementById("tutorialText");

var text = {
  0: "Drag blocks to the workspace",
  1: "Connect blocks together to form programs"
};

var workspaceChange = function(e) {
  let n = workspace.getAllBlocks().length;

  if (text[n] !== undefined) {
    tutorialDiv.style.display = "block";
    tutorialText.innerHtml = text[n];
  } else {
    tutorialDiv.style.display = "none";
    tutorialText.innerHtml = "";
  }
};
workspace.addChangeListener(workspaceChange);