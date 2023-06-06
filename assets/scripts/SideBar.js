// SideBar.js
import {fortunes} from '../fortunes.js';

export class SideBar {
  MAX_BUTTONS = 8;

  /**
   * Represents a sidebar of buttons.
   * @constructor
   * @param {*} textArray - array of strings to be used as button text
   * @throws {Error} if textArray is empty
   */
  constructor(textArray) {
    if (textArray.length === 0) {
      throw new Error('Sidebar cannot be empty!');
    }

    this.buttons = [];
    this.textValues = textArray.slice(0, this.MAX_BUTTONS);

    this.#init();
  }

  #init() {
    this.#generateButtons();
  }

  /**
   * Generate as many buttons as entries in textValues
   * @private
   */
  #generateButtons() {
    this.textValues.forEach((text) => {
      const button = document.createElement('button');
      button.textContent = text;
    });

    this.buttons.push(button);
  }

  setButtonClickHandler(someFunction) {
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => {
        someFunction(button);
      });
    });
  }
}

let defaultFortunes; // initialize default fortunes

/*
    Call on page load and loads in defaultFortunes
    TODO: create fortune loading handler
    and update button creation.
*/
document.addEventListener('DOMContentLoaded', () => {
  defaultFortunes = getFortunesFromStorage();
  if (!defaultFortunes) {
    defaultFortunes = fortunes.english.default;
  }
  activateSidebarHandler();

  activateBackgroundCycler();
});

// ========================================================
// BEGIN TODO REMOVE SECTION ==============================
// ========================================================
/*
  STAGED FOR TESTING BACKGROUND TILE IMAGES!
  DO NOT INCLUDE DURING PUSH TO MAIN!
  (unless desired as feature in which case create issue and ADR etc lol)
*/
const ALL_TILES = {0: 'stripes.png', 1: 'sometyles.png', 2: 'papers.png', 3: 'tmp37vebrpc.png', 4: 'tmp3r80pcbm.png', 5: 'tmp71n4gpm5.png', 6: 'tmp7huuov4m.png', 7: 'tmp8s4molq6.png', 8: 'tmpa2e3x5p2.png', 9: 'tmpbfmfw45b.png', 10: 'tmpbga782h1.png', 11: 'tmpcyixwdwf.png', 12: 'tmpd9biyi3x.png', 13: 'tmpdkuc7ag6.png', 14: 'tmpeg_8fvq5.png', 15: 'tmpfw1nmeu3.png', 16: 'tmpj4bbxwcp.png', 17: 'tmpk6ps6erw.png', 18: 'tmpluj4qakk.png', 19: 'tmpmng_5r7j.png', 20: 'tmpoto892nv.png', 21: 'tmpqtfxp41c.png', 22: 'tmpvg8h_3br.png', 23: 'tmpxthx308c.png'}
let currentBG = 0;
const ALL_TILES_LENGTH = Object.keys(ALL_TILES).length;

function activateBackgroundCycler() {
  const nextBackgroundButton = document.createElement('button');
  nextBackgroundButton.textContent = "NEXT BG";
  nextBackgroundButton.style.position = 'absolute';
  nextBackgroundButton.style.top = '0';
  nextBackgroundButton.style.right = '0';
  nextBackgroundButton.style.fontSize = '24px';

  nextBackgroundButton.addEventListener('click', () => {
    currentBG = (++currentBG > ALL_TILES_LENGTH - 1) ? 0 : currentBG;
    document.querySelector('body').style.backgroundImage = `url(assets/images/backgroundTiles/${ALL_TILES[currentBG]})`;
  })

  document.querySelector('body').prepend(nextBackgroundButton);
}

// ========================================================
// END TODO REMOVE SECTION ================================
// ========================================================


/*
    Handler for the fortune sidebar

    The sidebar needs to:
        - position buttons/accept edit requests
        - recive changes and update button values

    to do so, it uses a helper function for each
*/
function activateSidebarHandler() {
  activateSidebarButtons();
  activateFortuneInputHandler();
}

/*
    The sidebar is a vertical stack of buttons.

    We create the buttons here (to reduce styles and html
    clutter) then enable clicking to input new
    fortunes.
*/
function activateSidebarButtons() {
  // using defaultFortunes is a convenient
  // placeholder pending externalizing fortune
  // values and modularizing defaults
  const openSound = new Audio('assets/media/OpenFortune.mov');
  defaultFortunes.forEach((fortune, index) => {
    const button = document.createElement('button');
    button.textContent = fortune;

    button.addEventListener('click', () => {
      openFortuneInput(index);
      openSound.play();
    });

    getSidebar().appendChild(button);
  });
}

/*
    Set up the fortuneInputBox and display it.
*/
function openFortuneInput(buttonIndex) {
  getFortuneTextInput().value = getSidebarButtonContent(buttonIndex);
  getFortuneInputSaveButton().id = buttonIndex;
  getFortuneInputBox().style.display = 'block';
}

/*
    Tears down the fortuneInputBox and optionally
    by parameter passes along its value to the
    button which activated it.

    @param (bool) needToSubmitFortune
*/
function closeFortuneInput(needTosubmitFortune=false) {
  getFortuneInputBox().style.display = 'none';
  const closeSound = new Audio('assets/media/CloseFortune.mov');
  if (!needTosubmitFortune) {
    return;
  } else {
    const saveButton = getFortuneInputSaveButton();
    const userInput = getFortuneTextInput();

    setSidebarButtonContent(saveButton.id, userInput.value);
    userInput.value = '';

    saveButton.id = null;
    saveFortunes();
    closeSound.play();
  }
}

/*
    Handler for the fortuneInputBox

    submits when:
        - enter key in text input
        - changing fortune and losing focus
        - click save button

    doesn't submit when:
        - escape key
        - clicking anything other than the sidebar, input box, or save button
*/
function activateFortuneInputHandler() {
  getFortuneTextInput().addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      closeFortuneInput(true);
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeFortuneInput();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    const fortuneInputBox = getFortuneInputBox();
    const fortuneInputSaveButton = getFortuneInputSaveButton();
    if (
      fortuneInputBox.style.display === 'block' &&
      !target.closest('.sidebar') &&
      target !== fortuneInputSaveButton &&
      !fortuneInputBox.contains(target)
    ) {
      closeFortuneInput();
    }
  });

  getFortuneInputSaveButton().addEventListener('click', () => {
    closeFortuneInput(true);
  });
}

function getFortuneInputSaveButton() {
  return document.querySelector('.fortuneInputBox .saveButton');
}

function getFortuneInputBox() {
  return document.querySelector('.fortuneInputBox');
}

function getFortuneTextInput() {
  return document.querySelector('.fortuneInputBox input');
}

function getSidebar() {
  return document.querySelector('.sidebar');
}

function getSidebarButtons() {
  return document.querySelectorAll('.sidebar button');
}

function getSidebarButtonContent(index) {
  return getSidebarButtons()[index].textContent;
}

function setSidebarButtonContent(index, content) {
  getSidebarButtons()[index].textContent = content;
}

/**
 * Saves the fortune to local storage in JSON format
 * @param {Array<Object>} fortune - Array of user inputted fortunes
 * @returns {boolean} - Returns true if the fortune was saved successfully
 */

function saveFortunesToStorage(fortunes) {
  return localStorage.setItem('fortunes', JSON.stringify(fortunes));
}

/**
 * Reads 'fortunes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage for 'fortune', an empty array
 * is returned.
 * @return {Array<Object>} An array of fortunes found in localStorage
 */
function getFortunesFromStorage() {
  const fortuneList = localStorage.getItem('fortunes');
  if (fortuneList == null) {
    return false;
  }
  return JSON.parse(fortuneList);
}

/**
 * Store all user fortunes in an array, then save to local storage
 * Activated when the Play button is clicked
 */
function saveFortunes() {
  const fortunes = [];
  const buttons = getSidebarButtons();

  buttons.forEach((button) => { // Loop through each button and put the text conent into the fortunes array
    fortunes.push(button.textContent);
  });
  saveFortunesToStorage(fortunes);
}

export function saveFortunesOnClick() {
  saveFortunes();
  const fortunes = getFortunesFromStorage();
  return fortunes;
}

/**
 * Resets the sidebar by clearing its content, generating new buttons, and clearing localStorage.
 * @function
 */
export function resetSidebar() {
  const sidebar = getSidebar();
  sidebar.innerHTML = '';
  activateSidebarButtons();
  localStorage.clear();
}
