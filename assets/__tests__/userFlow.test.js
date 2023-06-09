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
   * Currently, this test is desgined to click a random button, change the input, save it, and then check to
   * make sure that the user sees this new input.
   */
  it('Changing preset randomly and checking preset was changed using different methods of saving...', async () => {
    console.log('Changing preset randomly...');

    const buttons = await page.$$('.sidebar button');
    const randomButtonIndex = getRandomIndex(buttons.length - 1);

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
    await frame.waitForSelector('path[id$="-click"]');
    const flapElements = await frame.$$('path[id$="-click"]');
    console.log(flapElements);
    const randomIndex = Math.floor(Math.random() * flapElements.length);
    console.log('Clicking random flap...');
    await flapElements[randomIndex].hover();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await flapElements[randomIndex].click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const localStorageFortunes = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('fortunes'));
    });
    console.log('localStorageFortunes:', localStorageFortunes);
    expect(localStorageFortunes).toEqual([
      'Outlook not so good',
      'Signs point to yes',
      'Cannot predict now',
      'Reply hazy, try again later',
      'It is certain',
      'Don\'t Count on it',
      'Better not tell you now',
      'As I see it, yes',
    ]);
  });
});

/*
TODO: Create test that randomly clicks a colored flap and checks the path on each
animation to ensure the correct SVG is being shown each time. Also checks number of 
SVG changes (animations) are correct.
*/
it('Checking a randomly clicked color flap outputs the correct number of animations and correct SVG each time...', async () => {

});

/*
TODO: Create test that checks to make sure Reset Fortunes Button and Sidebar are gone
after you click the fortune teller.
*/
it('Checking Reset Fortunes Button and Sidebar disappear after clicking fortune teller...', async ()=> {

});

/*
TODO: Create test that checks to make sure Reset Fortunes actually resets the fortunes. Check the 
text on the buttons and check LocalStorage.
*/
it('Checking Reset Fortunes Button resets fortunes on screen and in localStorage...', async () => {

});

/*
TODO: Create test that after clicking a number on either SVG with nums, the correct SVGs are shown and
there are the correct number of SVG changes (animations).
*/
it('Checking a randomly clicked number flap to output the correct number of animations and the correct SVG each time...', async () => {

});

/*
TODO: Create test that ensure the correct SVG is being display after user clicks on the any of the last
8 flaps.
*/
it('Checking correct SVG is displayed after clicking any of the last 8 flaps at the end to reveal fortune...', async () => {

});

/*
TODO: After clicking on any of the 8 last flaps, create test that ensures the fortue being display is one of
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

});

/*
TODO: (Extra if time) Create test that for any hover element if you hover over it, the correct functioanlity
happens (aka color change) and the cursor changes from pointer to hand.
*/
it('Checking each hoverable element is randomly hovered over ans functions correctly with color and cursor changes...', async () => {

});