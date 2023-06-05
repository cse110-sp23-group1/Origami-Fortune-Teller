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
   * make sure that the user sees this new input. Test needs to be redesigned to click random buttons, enter randomly
   * generated strings, randomly choose between pressing Enter or clicking Save, then checking the client-side.
   */
  it('Changing preset then checking preset was changed using different methods of saving...', async () => {
    console.log('Changing second preset...');
    await page.$$eval('.sidebar button', (buttons, index) => {
      buttons[index].click();
    }, 1);

    await page.waitForSelector('#fortuneInput');

    await page.$eval('#fortuneInput', (textbox) => {
      textbox.value = '';
    });

    await page.type('#fortuneInput', 'Will Never Happen');

    const saveButton = await page.$('.saveButton');
    saveButton.click();

    const buttonText = await page.$$eval('.sidebar button', (buttons) => {
      const button2 = buttons[1];
      return button2.textContent.trim();
    });

    expect(buttonText).toBe('Will Never Happen');
  });
});
