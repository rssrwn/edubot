var tutorialDiv = document.getElementById("tutorialDiv");
var tutorialText = document.getElementById("tutorialText");
var tutorialRunButton = document.getElementById("simpleRunButton");
var tutorialRestartButton = document.getElementById("simpleRunButton");

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
    tutorialText.innerText = text[tutorialPhase];
  } else {
    tutorialDiv.style.display = "none";
    tutorialText.innerText = "";
  }
};
workspace.addChangeListener(updateTutorial);

var runPressed = function(e) {
  if (tutorialPhase === 2) {
    tutorialPhase = 3;
  }
  updateTutorial();
}
tutorialRunButton.addEventListener("click", runPressed);

var restartPressed = function(e) {
  if (tutorialPhase === 3) {
    tutorialPhase = 4;
  }
  updateTutorial();
}
tutorialRestartButton.addEventListener("click", restartPressed);

updateTutorial();