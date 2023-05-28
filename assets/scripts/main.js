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
let svgDocument;

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
  // must load SVG content fully before accessing it
  closedFortune.addEventListener('load', function() {
    svgDocument = closedFortune.contentDocument;
    const closedFlaps = svgDocument.querySelectorAll('g[id$="-flap-d"] path[id$="-click"]');
    closedFlaps.forEach((flap) => {
      flap.addEventListener('click', (event) => {
        let flapID = event.target.getAttribute('id');
        startAnimation(flapID);
      });
    });
  });
  // activateClosedFlapClickHandler();
}
// function activateClosedFlapClickHandler() {
//   // console.log(document.getElementById('default').contentDocument);

// }
function startAnimation(flapID) {
  switch(flapID) {
    case 'upper-left-click':
      console.log("Red Flap Clicked");
      break;
    case 'lower-left-click':
      console.log("Green Flap Clicked");
      break;
    case 'upper-right-click':
      console.log("Blue Flap Clicked");
      break;
    case 'lower-right-click':
      console.log("Yellow Flap Clicked");
      break;
    default:
      console.log("Click Random");
      break;
  }
}
function getFortuneTeller() {
  return document.getElementById("closedFortune");
}

// function getClosedFlaps() {
// }