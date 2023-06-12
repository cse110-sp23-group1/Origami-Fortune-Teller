const svgPaths = [
  'assets/images/origami/closed.svg',
];
/**
 * Gets a random Odd Numbered Flap
 * @returns Random Odd number between 1 3 5 7
 */
function getRandomOddFlap() {
  const nums = [1, 3, 5, 7];
  const index = Math.floor(Math.random() * nums.length);
  return nums[index];
}
/**
 * Gets a random flap from the end to reveal fortune.
 * @returns A random opened flap from the end from 1 to 8
 */
function getRandomOpenedFlap() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8];
  const index = Math.floor(Math.random() * nums.length);
  return nums[index];
}
/**
 * Fucntion used in support to click on a flap randomly.
 * @param {Integer} length A parameter of current length of object.
 * @returns A random number from 0 to a given length
 */
function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

/**
 * Function to generate a random string to test on the buttons.
 * @param {Integer} maxLength Passed in max length of a string to generate.
 * @returns A random string of maxLength from characters
 */
function generateRandomString(maxLength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * maxLength) + 1;
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
/**
 * Used to see if we should click save or press enter
 * @param {*} randomButtonIndex a random button Index
 */
async function clickSaveorEnter(randomButtonIndex) {
  const shouldClickSaveButton = Math.random() < 0.5;
  if (shouldClickSaveButton) {
    console.log('Clicking save button...');
    const saveButton = await page.$(`button[id="${randomButtonIndex.toString()}"]`);
    saveButton.click();
  } else {
    console.log('Pressing enter...');
    await page.keyboard.press('Enter');
  }
}
/**
 * Function returns the text of buttons on the sidebar.
 * @returns The text of the buttons on the sidebar.
 */
async function getButtonText() {
  const buttonText = await page.$$eval('.sidebar button', (buttons) => {
    return buttons.map((button) => button.textContent.trim());
  });

  return buttonText;
}
describe('Basic user flow for Origami Fortune Teller', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp23-group1.github.io/Origami-Fortune-Teller/');
  });
  /**
   * Test to determine current fortunes the user sees. If the user's localStorage is empty, then the user should be seeing
   * the default fortunes given to them by us. If their localStorage is not empty, they have likely changed their default
   * fortunes and thus should be seeing the correct fortunes on page load.
   */
  it('Intial Load in Page - Check for correct fortune teller and preset fortunes from localStorage', async () => {
    console.log('Checking closed fortune teller is displayed...');
    const currentSVG = await page.$eval('object', (element) => element.getAttribute('data'));
    expect(currentSVG).toBe(svgPaths[0]);

    console.log('Checking current fortunes...');
    const localStorageFortunes = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('fortunes'));
    });

    const expectedFortunes = localStorageFortunes || [
      'Outlook not so good',
      'Signs point to yes',
      'Cannot predict now',
      'Reply hazy, try again later',
      'It is certain',
      'Don\'t Count on it',
      'Better not tell you now',
      'As I see it, yes',
    ];
    const buttonText = await getButtonText();
    expect(buttonText).toEqual(expectedFortunes);
  });

  /**
   * This test is desgined to click a random button, change the input, save it, and then check to
   * make sure that the user sees this new input.
   */
  it('Changing preset randomly and checking preset was changed using different methods of saving...', async () => {
    console.log('Changing preset randomly...');

    const buttons = await page.$$('.sidebar button');
    const randomButtonIndex = getRandomIndex(buttons.length);
    const clickedSideBarButton = buttons[randomButtonIndex];
    await clickedSideBarButton.click();
    await page.waitForSelector('#fortuneInput');
    const randomText = generateRandomString(35);
    await page.$eval('#fortuneInput', (textbox) => {
      textbox.value = '';
    });
    await page.waitForSelector('#fortuneInput');
    await page.focus('#fortuneInput');
    await page.keyboard.type(randomText);

    await clickSaveorEnter(randomButtonIndex);
    // wait 1001 ms for the 1001 ms animation to happen
    await new Promise((resolve) => setTimeout(resolve, 1001));

    const buttonText = await page.$$eval('.sidebar button', (buttons, index) => {
      const button = buttons[index];
      return button.textContent.trim();
    }, randomButtonIndex);

    expect(buttonText).toBe(randomText);
  });

  /**
   * Test to make sure clicking any flap should save the current fortunes listed in localStorage.
   */
  it('Clicking any flap on the closed SVG saves fortunes to localstorage...', async () => {
    console.log('Without editing fortunes, checking presets are saved on first click...');
    await page.waitForSelector('object');
    const objectElementHandle = await page.$('object');
    const frame = await objectElementHandle.contentFrame();
    const svgElement = await frame.$('svg');
    const flaps = await svgElement.$$('path[id*="-click"]');
    const randomFlapIndex = getRandomIndex(flaps.length);
    const buttonText = await getButtonText();
    await flaps[randomFlapIndex].click();
    console.log('Clicking random flap...');

    await new Promise((resolve) => setTimeout(resolve, 500));

    const localStorageFortunes = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('fortunes'));
    });
    expect(localStorageFortunes).toEqual(buttonText);
  });
});

/**
 * Test to make sure buttons and sidebar disappear after clicking on fortune teller.
 */
it('Checking Reset Fortunes Button and Sidebar disappear after clicking fortune teller...', async ()=> {
  await page.waitForSelector('object');
  const objectElementHandle = await page.$('object');
  const frame = await objectElementHandle.contentFrame();
  const svgElement = await frame.$('svg');
  const flaps = await svgElement.$$('path[id*="-click"]');
  const randomFlapIndex = getRandomIndex(flaps.length);
  console.log('clicking random flap...');
  await flaps[randomFlapIndex].click();

  const sidebarDisplayStyle = await frame.$$('.sidebar', (sidebar) => {
    return window.getComputedStyle(sidebar).display;
  });

  const resetButtonDisplayStyle = await frame.$$('.resetSide', (resetButton) => {
    return window.getComputedStyle(resetButton).display;
  });

  const inputBoxDisplayStyle = await frame.$$('.fortuneInputBox', (inputBox) => {
    return window.getComputedStyle(inputBox).display;
  });

  expect(sidebarDisplayStyle).toStrictEqual([]);
  expect(resetButtonDisplayStyle).toStrictEqual([]);
  expect(inputBoxDisplayStyle).toStrictEqual([]);
});

/**
 * The test below changes a fortune, clicks the Reset Fortunes Button, and checks local Storage to make sure it is empty.
 */
it('Checking Reset Fortunes Button resets fortunes in localStorage', async () => {
  console.log('Resetting page');
  await page.reload();
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.removeItem('fortune');
  });
  await page.reload();
  console.log('Changing fortune...');
  const buttons = await page.$$('.sidebar button');
  const randomButtonIndex = getRandomIndex(buttons.length);
  await buttons[randomButtonIndex].click();
  await page.waitForSelector('#fortuneInput');
  const randomText = generateRandomString(35);
  await page.$eval('#fortuneInput', (textbox) => {
    textbox.value = '';
  });
  await page.waitForSelector('#fortuneInput');
  await page.focus('#fortuneInput');
  await page.keyboard.type(randomText);
  await clickSaveorEnter(randomButtonIndex);
  console.log('Clicking reset fortunes button');
  await page.waitForTimeout(1500);
  const resetButton = await page.$('.resetSide');
  await resetButton.click();

  await new Promise((resolve) => setTimeout(resolve, 500));
  const localStorageFortunes = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('fortunes'));
  });
  // null because fortunes are not saved until you change a preset or click a flap after reset
  expect(localStorageFortunes).toBe(null);
}, 10000);

/**
 * Test to make sure default fortunes is what user sees first time entering our site.
 */
it('Checking Fortunes are correct at start', async () => {
  await page.reload();
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.removeItem('fortune');
  });
  await page.reload();
  const buttons = await page.$$('.sidebar button');
  await page.waitForTimeout(500);
  const expected = [
    'Outlook not so good',
    'Signs point to yes',
    'Cannot predict now',
    'Reply hazy, try again later',
    'It is certain',
    'Don\'t Count on it',
    'Better not tell you now',
    'As I see it, yes',
  ];
  const actual = [];

  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].evaluate((button) => button.textContent);
    actual.push(text);
  }
  expect(actual).toEqual(expected);
});

/**
 * Test to make sure flow of origami works. Then, at the end, the fortune revealed exists in local storage
 * Also, when user clicks restart button, closedSVG is shown, sidebar buttons have correct text, and local storage
 * remains the same.
 */
it('Checking restart button changes SVG back to closed, has correct elements on screen, and sidebar buttons have correct text and localStorage is unchanged...', async () => {
  // Simulates first click on closed svg
  await page.waitForSelector('object', {timeout: 2000});
  const objectElementHandle = await page.$('object');
  const frame = await objectElementHandle.contentFrame();
  await objectElementHandle.boundingBox();
  await frame.waitForSelector('svg');
  await frame.waitForSelector('svg', {timeout: 2000});
  await frame.waitForSelector('#lower-right-click', {timeout: 2000});
  const flap = await frame.$('#lower-right-click');
  console.log('Clicking closed flap...');
  flap.click()
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Get current fortunes from localStorage
  const localStorageFortunesPre = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('fortunes'));
  });
  // wait 5 seconds for animation to finish 500 ms * y e l l o w = 3000 ms + network
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // click on numbered svg
  await page.waitForSelector('object');
  const objectElementHandle2 = await page.$('object');
  const frame2 = await objectElementHandle2.contentFrame();
  await frame2.waitForSelector('svg');
  const svgElement2 = await frame2.$('svg');
  const randomFlapIndex2 = getRandomOddFlap();
  const oddFlap = await svgElement2.$(`text[id="${randomFlapIndex2}"]`);
  console.log('Clicking a number on fortune teller...');
  await oddFlap.click();

  // wait 5 seconds for animation to finish 500 ms * 8 = 4000 ms + network
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // click on 8 opened svg
  await page.waitForSelector('object');
  const objectElementHandle3 = await page.$('object');
  const frame3 = await objectElementHandle3.contentFrame();
  const svgElement3 = await frame3.$('svg');
  const randomFlapIndex4 = getRandomOpenedFlap();
  const fortuneFlap = await svgElement3.$(`text[id="${randomFlapIndex4}"]`);
  console.log('Clicking on a fortune to reveal...');
  await fortuneFlap.click();

  // wait 5 seconds for new svg to display
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('Grabbing text on flap...');
  await page.waitForSelector('.origamiFortuneOverlay');
  const text = await page.$eval('.origamiFortuneOverlay > p:nth-child(2)', (element) => element.textContent);
  const expectedLocalStorage = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('fortunes'));
  });
  expect(expectedLocalStorage).toContain(text);
  // Click reset button
  console.log('Clicking reset button');
  const restartButton = await page.$('.restart');
  await restartButton.click();
  // wait 2 seconds for reset to go through
  await page.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.waitForSelector('object');
  const currentSVG = await page.$eval('object', (element) => element.getAttribute('data'));
  expect(currentSVG).toBe(svgPaths[0]);
  // Checks if sidebarDisplayStyle exists
  const sidebarDisplayStyle = await page.$eval('.sidebar', (sidebar) => {
    return window.getComputedStyle(sidebar).display;
  });

  // Checks if all fortunes in sidebar boxes are the same as before
  const buttons = await page.$$('.sidebar button');
  let goodFortunes = 0;
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].evaluate((button) => button.textContent);
    if (localStorageFortunesPre.includes(text)) {
      goodFortunes++;
    }
  }

  // Gets fortunes after reset
  const localStorageFortunesPost = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('fortunes'));
  });

  expect(goodFortunes).toBe(8);
  expect(localStorageFortunesPost).toStrictEqual(localStorageFortunesPre);
  expect(sidebarDisplayStyle).toStrictEqual('grid');
}, 20000);
