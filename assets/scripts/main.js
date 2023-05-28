/*
// Upon Page load, call activateSidebarHandler()
document.addEventListener('DOMContentLoaded', () => {
  activateSidebarHandler();
});

// If any button is clicked in the sidebar, call editFortuneBox(button), which takes an argument of the button that was clicked
function activateSidebarHandler() {
  const sidebarButtons = document.querySelectorAll('.sidebarButton');

  sidebarButtons.forEach((button) => {
    button.addEventListener('click', () => {
      editFortune(button);
    });
  });
}

// Make the editFortuneBox appear, allow the user to write in their own fortune, and change the text of the button that was passed in
function editFortune(button) {
  const editFortuneBox = document.getElementById('editFortuneBox');
  const saveButton = document.querySelector('.saveButton');
  const userInput = document.getElementById('userInput');

  editFortuneBox.style.display = 'block';

  saveButton.addEventListener('click', () => {
    button.textContent = userInput.value;
    editFortuneBox.style.display = 'none';
  });
}
*/
let svgPaths;

document.addEventListener('DOMContentLoaded', () => {
  fetch('assets/SVGPaths/svgPaths.json')
  .then((response) => response.json())
  .then((data) => {
    svgPaths = data.filePaths;
    activateSVGHandler();
  })
  .catch((error) => {
    console.error('Error fetching fortunes:', error);
  });
});


function activateSVGHandler() {
  activateClosedHandler();
  //activateNumberHandler();
  //activateFortuneClickHandler();
}

function activateClosedHandler() {
  const closedFortune = document.createElement('object');
  closedFortune.data = svgPaths.closed;
  closedFortune.id = "default";
  getFortuneTeller().appendChild(closedFortune);
  activateClosedFlapClickHandler();
}
function activateClosedFlapClickHandler() {
  getClosedFlaps().forEach((flap) => {
    flap.addEventListener('click', () => {
      startAnimation();
    });
  });
}
function startAnimation() {
  console.log("this flap click worked");
}
function getFortuneTeller() {
  return document.getElementById("closedFortune");
}

function getClosedFlaps() {
  return document.getElementById('default').querySelectorAll('g[id$="-flap-d"] path[id$="-click"]');
}