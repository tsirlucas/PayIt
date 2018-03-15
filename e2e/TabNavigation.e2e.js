import wd from 'wd';
import config from '../e2e.config';

const port = 4723;
const driver = wd.promiseChainRemote('localhost', port);
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const tapElementByAccessibilityId = async (id) => {
  const button = await driver.elementByAccessibilityId(id);
  await button.tap();
};

describe('TabNavigation', () => {
  // timeout(200000)

  beforeAll(async () => {
    await driver.init(config);
    while (!await driver.hasElementByAccessibilityId('nav bar')) {
      await driver.sleep(1000); // wait for app to load
    }
  });
  afterAll(async () => await driver.quit());

  it('should render tabs', async () => {
    expect(await driver.hasElementByAccessibilityId('nav bar')).toBe(true);
  });

  it('should start in home', async () => {
    expect(await driver.hasElementByAccessibilityId('Home title')).toBe(true);
  });

  it('should be able to navigate to bills', async () => {
    await tapElementByAccessibilityId('bills button');
    expect(await driver.hasElementByAccessibilityId('Bills title')).toBe(true);
  });
  it('should be able to navigate to settings', async () => {
    await tapElementByAccessibilityId('settings button');
    expect(await driver.hasElementByAccessibilityId('Settings title')).toBe(true);
  });
  it('should be able to navigate to home', async () => {
    await tapElementByAccessibilityId('home button');
    expect(await driver.hasElementByAccessibilityId('Home title')).toBe(true);
  });
});
