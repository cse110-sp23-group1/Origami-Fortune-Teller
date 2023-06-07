import {getDarkerShade, getOriginalColor} from '../scripts/utilities/colors.js';
describe('Testing different flaps on getDarkerShade()', () => {
  /*
  So these specifc 4 tests pass, but I'm not sure why based
  off the file in Origami.js
  */
  test('blue flap darkens to #0D6E8E', () => {
    expect(getDarkerShade('#118AB2')).toBe('#0D6E8E');
  });
  test('red flap darkens to #BF3858', () => {
    expect(getDarkerShade('#EF476F')).toBe('#BF3858');
  });
  test('green flap darkens to #04AB80', () => {
    expect(getDarkerShade('#06D6A0')).toBe('#04AB80');
  });
  test('yellow flap darkens to #CCA751', () => {
    expect(getDarkerShade('#FFD166')).toBe('#CCA751');
  });
});
describe('Testing different flaps on getOriginalColor()', () => {
  test('#0D6E8E lightens back to blue', () => {
    expect(getOriginalColor('#0D6E8E')).toBe('#118AB2');
  });
  // failing, idk why
  test('#BF3858 lightens back to red', () => {
    expect(getOriginalColor('#BF3858')).toBe('#962B44');
  });
  // failing idk why
  test('#04AB80 lightens back to green', () => {
    expect(getOriginalColor('#04AB80')).toBe('#00664C');
  });
  test('#CCA751 lightens back to yellow', () => {
    expect(getOriginalColor('#CCA751')).toBe('#FFD166');
  });
});
