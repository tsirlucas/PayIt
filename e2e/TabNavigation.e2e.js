import wd from 'wd';
import config from '../e2e.config';

const port = 4723;
const driver = wd.promiseChainRemote('localhost', port);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('TabNavigation', () => {
  // timeout(200000)

  beforeAll(async () => {
    await driver.init(config);
    await driver.sleep(3000); // wait for app to load
  })
  afterAll(async () => await driver.quit());

  it('should render tabs', async () => {
    expect(await driver.hasElementByAccessibilityId('nav bar')).toBe(true);
  });

  it('should start in home', async () => {
    expect(await driver.hasElementByAccessibilityId('Home title')).toBe(true);
  });

  it('should be able to navigate to bills', async () => {
    const button = await driver.elementByAccessibilityId('bills button');
    await button.tap();
    expect(await driver.hasElementByAccessibilityId('Bills title')).toBe(true);
  });
  it('should be able to navigate to settings', async () => {
    const button = await driver.elementByAccessibilityId('settings button');
    await button.tap();
    expect(await driver.hasElementByAccessibilityId('Settings title')).toBe(true);
  });
  it('should be able to navigate to home', async () => {
    const button = await driver.elementByAccessibilityId('home button');
    await button.tap();
    expect(await driver.hasElementByAccessibilityId('Home title')).toBe(true);
  });
});
