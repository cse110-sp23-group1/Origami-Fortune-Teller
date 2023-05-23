// main.js
import {SideBar} from './SideBar.js';

/*
    Calls on page load
*/
document.addEventListener('DOMContentLoaded', () => {
  activateSidebarHandler();
});

// TODO: create fortune loading handler
// and update button creation.
// placeholder values:
const defaultFortunes = [
  'Outlook not so good',
  'Signs point to yes',
  'Cannot predict now',
  'Reply hazy, try again later',
  'It is certain',
  'Don\'t Count on it',
  'Better not tell you now',
  'As I see it, yes',
];

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
    if (event.key === 'Enter') closeFortuneInput(true);
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
