const svgPaths = [
  'assets/images/origami/closed.svg',
  'assets/images/origami/horizontally-opened-nums.svg',
  'assets/images/origami/vertically-opened-nums.svg',
  'assets/images/origami/horizontally-opened.svg',
  'assets/images/origami/vertically-opened.svg',
  'assets/images/origami/opened.svg',
  'assets/images/origami/1-opened.svg',
  'assets/images/origami/2-opened.svg',
  'assets/images/origami/3-opened.svg',
  'assets/images/origami/4-opened.svg',
  'assets/images/origami/5-opened.svg',
  'assets/images/origami/6-opened.svg',
  'assets/images/origami/7-opened.svg',
  'assets/images/origami/8-opened.svg',
];
function getRandomEvenFlap() {
  const nums = [2, 4, 6, 8];
  const index = Math.floor(Math.random() * nums.length);
  return nums[index];
}
function getRandomOddFlap() {
  const nums = [1, 3, 5, 7];
  const index = Math.floor(Math.random() * nums.length);
  return nums[index];
}
function getRandomOpenedFlap() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8];
  const index = Math.floor(Math.random() * nums.length);
  return nums[index];
}
function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

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

    console.log('checking current fortunes...');
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
    const buttonText = await page.$$eval('.sidebar button', (buttons) => {
      return buttons.map((button) => button.textContent.trim());
    });
    expect(buttonText).toEqual(expectedFortunes);
  });

  /**
   * Currently, this test is desgined to click a random button, change the input, save it, and then check to
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

    const shouldClickSaveButton = Math.random() < 0.5;
    if (shouldClickSaveButton) {
      console.log('Clicking save button...');
      const saveButton = await page.$(`button[id="${randomButtonIndex.toString()}"]`);
      saveButton.click();
    } else {
      console.log('Pressing enter...');
      await page.keyboard.press('Enter');
    }
    // wait 1001 ms for the 1001 ms animation to happen
    await new Promise((resolve) => setTimeout(resolve, 1001));

    const buttonText = await page.$$eval('.sidebar button', (buttons, index) => {
      const button = buttons[index];
      return button.textContent.trim();
    }, randomButtonIndex);

    expect(buttonText).toBe(randomText);
  });

  /**
   * Clicking any flap should save the current fortunes listed in localStorage. Currently, the test below
   * is making sure if the user edits nothing, the default fortunes are saved to localStorage, but this
   * test doesn't work bc ithink the previous test is messing it up.
   */
  it('Clicking any flap on the closed SVG saves fortunes to localstorage...', async () => {
    console.log('Without editing fortunes, checking presets are saved on first click...');
    await page.waitForSelector('object');
    const objectElementHandle = await page.$('object');
    const frame = await objectElementHandle.contentFrame();
    const svgElement = await frame.$('svg');
    const flaps = await svgElement.$$('path[id*="-click"]');
    const randomFlapIndex = getRandomIndex(flaps.length);
    const buttonText = await page.$$eval('.sidebar button', (buttons) => {
      return buttons.map((button) => button.textContent.trim());
    });
    await flaps[randomFlapIndex].click();
    console.log('Clicking random flap...');

    await new Promise((resolve) => setTimeout(resolve, 500));

    const localStorageFortunes = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('fortunes'));
    });
    expect(localStorageFortunes).toEqual(buttonText);
  });
});

/*
TODO: Create test that checks to make sure Reset Fortunes Button and Sidebar are gone
after you click the fortune teller.
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
  console.log('Clicking random flap...');

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

/*
Clicking the reset Fortunes button empties local Storage. The test below changes a fortune, clicks the Reset
Fortunes Button, and checks local Storage to make sure it is empty.
*/
it('Checking Reset Fortunes Button resets fortunes in localStorage', async () => {
  console.log('reset page');
  await page.reload();
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.removeItem('fortune');
  });
  await page.reload();
  console.log('change a fortune');
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
  const shouldClickSaveButton = Math.random() < 0.5;
  if (shouldClickSaveButton) {
    console.log('Clicking save button...');
    const saveButton = await page.$(`button[id="${randomButtonIndex.toString()}"]`);
    saveButton.click();
  } else {
    console.log('Pressing enter...');
    await page.keyboard.press('Enter');
  }
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

/*
Checks if the default fortunes are what the user sees.
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

/*
TODO: Create test that ensure the correct SVG is being display after user clicks on the any of the last
8 flaps.
*/
it('Checking correct SVG is displayed after clicking any of the last 8 flaps at the end to reveal fortune...', async () => {
  // stimulates clicking the flaps
  await page.waitForSelector('object');
  const objectElementHandle = await page.$('object');
  const frame = await objectElementHandle.contentFrame();
  const svgElement = await frame.$('svg');
  const flaps = await svgElement.$$('path[id*="-click"]');
  const randomFlapIndex = getRandomIndex(flaps.length);
  await flaps[randomFlapIndex].click();
  await flaps[randomFlapIndex].click();
  await flaps[randomFlapIndex].click();

  // Need to grab flapData properly (NOT WORKING)
  // Need to properly grab the data from the p tag in order to compare it with contents of the data in local storage.
  const flapData = await page.$$('.origamiFortuneOverlay p');
  console.log(flapData);

  const textContent = await flapData[0].evaluate((p) => p.textContent);

  // This tests to see if the text is in the array of changes. If it is set the foundFortune to true
  console.log(textContent);
  const buttons = await page.$$('.sidebar button');
  let foundFortune = false;
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].evaluate((button) => button.textContent);
    if (text === 'Change to the fortune clicked') {
      foundFortune = true;
      return;
    }
  }
  expect(foundFortune).toEqual(true);
});

/*
TODO: After clicking on any of the 8 last flaps, create test that ensures the fortune being display is one of
the fortunes from the localStorage.
*/
it('Checking clicking any random flap from the last 8 flaps to reveal fortune, reveals a random fortune from localStorage and display correctly...', async () => {

});

/*
TODO: Create test that ensures Restart button changes SVG path back to closed, has the correct elements
display on the screen (should be same elements when you enter page for the first time) and that the sidebar
buttons still have the right text saved on them from localStorage.
*/
it('Checking restart button changes SVG back to closed, has correct elements on screen, and sidebar buttons have correct text and localStorage is unchanged...', async () => {
  // Simulates first click on closed svg
  await page.waitForSelector('object', {timeout: 2000});
  const objectElementHandle = await page.$('object');
  const frame = await objectElementHandle.contentFrame();
  await objectElementHandle.boundingBox();
  await frame.waitForSelector('svg');
  const svgElement = await frame.waitForSelector('svg', {timeout: 2000});
  await frame.waitForSelector('path[id*="-click"]', {timeout: 2000});
  const flaps = await frame.$$('path[id*="-click"]');
  console.log(flaps);
  const randomFlapIndex = getRandomIndex(flaps.length);
  console.log('Clicking random closed flap...');
  console.log(flaps[randomFlapIndex]);
  flaps[randomFlapIndex].click();
  // Inspect element properties using evaluate
  const flapProperties = await frame.evaluate((flap) => {
    const boundingBox = flap.getBoundingClientRect();
    const computedStyle = getComputedStyle(flap);
    return {
      id: flap.id,
      isVisible: flap.offsetParent !== null,
      boundingBox: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
      },
      color: computedStyle.color,
      backgroundColor: computedStyle.backgroundColor,
      // Add more CSS properties as needed
    };
  }, flaps[randomFlapIndex]);


  console.log('Flap properties:', flapProperties);
  // Saves current fortunes from localStorage
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
  // if oddflap is null, it must be the vertical fortune teller being shown...
  if (oddFlap === null) {
    const randomFlapIndex3 = getRandomEvenFlap();
    await frame2.waitForSelector(`text[id="${randomFlapIndex3}"]`);
    const evenFlap = await svgElement2.$(`text[id="${randomFlapIndex3}"]`);
    console.log('Clicking on vertical fortune teller...');
    await evenFlap.click();
  } else {
    console.log('Clicking on horizontal fortune teller...');
    await oddFlap.click();
  }

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

  // Click reset button
  console.log('Clicking reset button');
  const restartButton = await page.$('.restart');
  await restartButton.click();
  // wait 2 seconds for reset to go through
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.waitForSelector('object');
  const currentSVG = await page.$eval('object', (element) => element.getAttribute('data'));
  expect(currentSVG).toBe(svgPaths[0]);

  // Checks if sidebarDisplayStyle exists
  const sidebarDisplayStyle = await frame.$eval('.sidebar', (sidebar) => {
    return window.getComputedStyle(sidebar).display;
  });
  console.log(sidebarDisplayStyle);

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
