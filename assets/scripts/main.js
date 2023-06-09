import {activateSidebarHandler, resetSidebar} from './SideBar.js';
import {Origami} from './Origami.js';


/**
 * Activators need on initial page load
 */
document.addEventListener('DOMContentLoaded', () => {
  new Origami();
  activateSidebarHandler();
});

/**
 * Adds an event listener to the "restart" button and reloads the page.
 * @function
 */
document.querySelector('.restart').addEventListener('click', () => {
  document.querySelector('.resetSide').style.display = '';
  location.reload();
});

/**
 * Adds an event listener to the "resetSide" button, calls the resetSidebar function, and reloads the page without playing animations.
 * @function
 */
document.querySelector('.resetSide').addEventListener('click', () => {
  resetSidebar();
  sessionStorage.setItem('animationEnabled', 'false');
  location.reload();
});


function toggleAnimation() {
  const titleHeader = document.getElementById('titleHeader');
  const animationEnabled = sessionStorage.getItem('animationEnabled');

  if (animationEnabled !== 'false') {
    titleHeader.classList.add('slide-in');
  }
}

window.addEventListener('load', function() {
  toggleAnimation();
  sessionStorage.removeItem('animationEnabled');
});
