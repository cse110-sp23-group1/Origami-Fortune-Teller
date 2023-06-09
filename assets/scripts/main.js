import {activateSidebarHandler, resetSidebar} from './SideBar.js';
import {Origami} from './Origami.js';


/**
 * Activators needed on initial DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
  new Origami();
  activateSidebarHandler();
});

/**
 * Activators needed on window loads
 */
window.addEventListener('load', () => {
  toggleHeaderAnimation();
  sessionStorage.removeItem('animationEnabled');
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

/**
 * If animations are enabled, add a slide-in to the title header
 * @function
 */
function toggleHeaderAnimation() {
  const titleHeader = document.getElementById('titleHeader');
  const animationEnabled = sessionStorage.getItem('animationEnabled');

  if (animationEnabled !== 'false') {
    titleHeader.classList.add('slide-in');
  }
}
