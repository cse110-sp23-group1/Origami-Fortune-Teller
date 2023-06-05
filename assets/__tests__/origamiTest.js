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
   * Currently, this test is desgined to click the second button, change the input, save it, and then check to
   * make sure that the user sees this new input.
   */
  it('Changing preset randomly and checking preset was changed using different methods of saving...', async () => {
    console.log('Changing preset randomly...');

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
      const saveButton = await page.$('.saveButton');
      await saveButton.click();
    } else {
      console.log('Pressing enter...');
      await page.keyboard.press('Enter');
    }

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
    console.log('Reloading page to reset fortunes...');
    await page.evaluate(() => {
      return localStorage.clear();
    });
    await page.reload();
    console.log('Without editing fortunes, checking presets are saved on first click...');
    await page.waitForSelector('object');
    const objectElementHandle = await page.$('object');
    const frame = await objectElementHandle.contentFrame();
    const flaps = await frame.$$('path[id$="-click"]');

    const randomIndex = Math.floor(Math.random() * flaps.length);
    await flaps[randomIndex].click();

    setTimeout(async () => {
      const localStorageFortunes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('fortunes'));
      });
      expect(localStorageFortunes).toBe([
        'Outlook not so good',
        'Signs point to yes',
        'Cannot predict now',
        'Reply hazy, try again later',
        'It is certain',
        'Don\'t Count on it',
        'Better not tell you now',
        'As I see it, yes',
      ]);
    }, 1000);
  });
});
