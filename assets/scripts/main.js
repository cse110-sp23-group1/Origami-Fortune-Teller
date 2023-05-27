// main.js
import {SideBar} from './SideBar.js';


let defaultFortunes; // initialize default fortunes

/*
    Call on page load and loads in defaultFortunes
    TODO: create fortune loading handler
    and update button creation.
*/
document.addEventListener('DOMContentLoaded', () => {
  fetch('/assets/fortunes.json')
      .then((response) => response.json())
      .then((data) => {
        defaultFortunes = data.english.default; // Assign the default fortunes to the variable

        activateSidebarHandler();
      })
      .catch((error) => {
        console.error('Error fetching fortunes:', error);
      });
});

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
  const buttonHeight = 73;

  // using defaultFortunes is a convenient
  // placeholder pending externalizing fortune
  // values and modularizing defaults
  defaultFortunes.forEach((fortune, index) => {
    const button = document.createElement('button');
    button.textContent = fortune;

    button.style.top = `${index*buttonHeight}px`;
    button.addEventListener('click', () => {
      openFortuneInput(index);
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

  if (!needTosubmitFortune) {
    return;
  } else {
    const saveButton = getFortuneInputSaveButton();
    const userInput = getFortuneTextInput();

    setSidebarButtonContent(saveButton.id, userInput.value);
    userInput.value = '';

    saveButton.id = null;
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
*/
function activateFortuneInputHandler() {
  let escape = false;
  getFortuneTextInput().addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      closeFortuneInput(true);
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeFortuneInput();
      escape = true;
    }
  });

  getFortuneTextInput().addEventListener('change', (event) => {
    if (escape == true) {
      escape = false;
      return;
    }
    saveFortunes();
    closeFortuneInput(true);
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

function saveFortuneToStorage(fortune) {
  return localStorage.setItem('fortune', JSON.stringify(fortune));
}

/**
 * Reads 'fortune' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage for 'fortune', an empty array
 * is returned.
 * @return {Array<Object>} An array of fortunes found in localStorage
 */
function getFortuneFromStorage() {
  let fortuneList = localStorage.getItem("fortune");
  if (fortuneList == null) {
    return [];
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
  saveFortuneToStorage(fortunes);
}


