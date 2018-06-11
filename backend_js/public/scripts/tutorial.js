var tutorialDiv = document.getElementById("tutorialDiv");
var tutorialText = document.getElementById("tutorialText");
var tutorialPhase = 0;

var text = {
  0: "Drag blocks to the workspace",
  1: "Connect blocks together to form programs",
  2: "Press run to execute your program",
  3: "Press restart to reset EduBot"
};

var updateTutorial = function(e) {
  let n = workspace.getAllBlocks().length;
  
  if (n == 0) {
    tutorialPhase = 0;
  }
  if (n == 1) {
    tutorialPhase = 1;
  }
  if (n == 2) {
    let blocks = workspace.getTopBlocks();
    if (blocks.length == 1) {
      tutorialPhase = 2;
    }
  }

  if (text[tutorialPhase] !== undefined) {
    tutorialDiv.style.display = "block";
    tutorialText.innerHtml = text[tutorialPhase];
  } else {
    tutorialDiv.style.display = "none";
    tutorialText.innerHtml = "";
  }
};
workspace.addChangeListener(updateTutorial);

updateTutorial();