// SideBar.js

export class SideBar {
  MAX_BUTTONS = 8;

  /**
   * Represents a sidebar of buttons.
   * @constructor
   * @param {*} textArray - array of strings to be used as button text
   * @param {*} buttonHeight - height of each button in pixels
   * @throws {Error} if textArray is empty
   */
  constructor(textArray, buttonHeight=73) {
    if (textArray.length === 0) {
      throw new Error('Sidebar cannot be empty!');
    }

    this.buttons = [];
    this.buttonHeight = buttonHeight;
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
    this.textValues.forEach((text, index) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.top = `${index*this.buttonHeight}px`;
    });

    this.buttons.push(button);
  }

  /**
   * Appending buttons to a container
   * @param {*} container - HTMLElement to append buttons to
   */
  appendAllButtonsToContainer(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error(`SideBar.appendAllButtonsToContainer requires HTMLElement, but was given: ${typeof(container)}!`);
    }

    this.buttons.forEach((button) => {
      container.appendChild(button);
    });
  }

  setButtonClickHandler(someFunction) {
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => {
        someFunction(button);
      });
    });
  }
}
