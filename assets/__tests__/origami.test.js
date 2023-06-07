import {getDarkerShade, getOriginalColor} from '../scripts/utilities/colors.js';
describe('Testing different flaps on getDarkerShade()', () => {
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
