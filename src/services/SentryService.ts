import {Sentry} from 'react-native-sentry';

export class SentryService {
  private static instance: SentryService;
  private sentry: typeof Sentry;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SentryService();
    }

    return this.instance;
  }

  constructor() {
    this.sentry = Sentry;
  }

  public config = () => {
    if (!__DEV__) {
      this.sentry
        .config(
          'https://8b281b871daa400a97c9d08b39b17283:b07cd55c513241b88bb07025d6005abf@sentry.io/1202837',
        )
        .install();
    }
  };

  // tslint:disable-next-line
  public setUserContext = Sentry.setUserContext;

  // tslint:disable-next-line
  public captureException = Sentry.captureException;
}
