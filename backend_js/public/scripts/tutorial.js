var workspaceChange = function(e) {
  let n = workspace.getAllBlocks().length;
  console.log(n);
};
workspace.addChangeListener(workspaceChange);