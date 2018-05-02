import {CategorizedPendencies, Pendency} from 'models';

import {I18n} from '../../i18n';
import {buildMessage, categorizePendencies} from './notification';

describe('categorizePendencies', () => {
  it('should return categorized pendencies', () => {
    const mockedPendencies = {
      id: 'ID',
      data: {
        ['ID1']: {
          id: 'ID1',
          billId: 'billId',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'IDEAL',
        },
        ['ID2']: {
          id: 'ID2',
          billId: 'billId',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'DELAYED',
        },
        ['ID3']: {
          id: 'ID3',
          billId: 'billId',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'NEXT',
        },
      },
    };

    const result = categorizePendencies(mockedPendencies);

    expect(Object.keys(result).length).toEqual(2);
    expect(result.ideal.length).toEqual(1);
    expect(result.ideal[0].type).toEqual('IDEAL');
    expect(result.delayed.length).toEqual(1);
    expect(result.delayed[0].type).toEqual('DELAYED');
  });
});

describe('buildMessage', () => {
  it('should return complete message when have delayed and ideal pendencies', () => {
    const mockFunction = jest.fn().mockReturnValue('message');

    I18n.t = mockFunction;

    const mockedPendencies = {
      delayed: [
        {
          id: 'ID1',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'DELAYED',
        },
      ],
      ideal: [
        {
          id: 'ID2',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'IDEAL',
        },
      ],
    };

    buildMessage(mockedPendencies as CategorizedPendencies);

    expect(mockFunction).toBeCalledWith('notification.delayedStart', {count: 1});
    expect(mockFunction).toBeCalledWith('notification.idealEnd', {message: 'message', count: 1});
    expect(mockFunction).not.toBeCalledWith('notification.idealStart', {
      message: 'message',
      count: 1,
    });
    expect(mockFunction).toBeCalledWith('notification.tapAction', {message: 'message'});
  });

  it('should return only ideal message when theres only ideal pendencies', () => {
    const mockFunction = jest.fn().mockReturnValue('message');

    I18n.t = mockFunction;

    const mockedPendencies = {
      delayed: [] as Pendency[],
      ideal: [
        {
          id: 'ID2',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'IDEAL',
        },
      ],
    };

    buildMessage(mockedPendencies as CategorizedPendencies);

    expect(mockFunction).not.toBeCalledWith('notification.delayedStart');
    expect(mockFunction).toBeCalledWith('notification.idealStart', {count: 1});
    expect(mockFunction).not.toBeCalledWith('notification.idealEnd', {
      message: 'message',
      count: 1,
    });
    expect(mockFunction).toBeCalledWith('notification.tapAction', {message: 'message'});
  });

  it('should return only delayed message when theres only delayed pendencies', () => {
    const mockFunction = jest.fn().mockReturnValue('message');

    I18n.t = mockFunction;

    const mockedPendencies = {
      ideal: [] as Pendency[],
      delayed: [
        {
          id: 'ID2',
          description: 'Random',
          expirationDay: 'random',
          value: 450.85,
          type: 'DELAYED',
        },
      ],
    };

    buildMessage(mockedPendencies as CategorizedPendencies);

    expect(mockFunction).toBeCalledWith('notification.delayedStart', {count: 1});
    expect(mockFunction).not.toBeCalledWith('notification.idealStart');
    expect(mockFunction).not.toBeCalledWith('notification.idealEnd');
    expect(mockFunction).toBeCalledWith('notification.tapAction', {message: 'message'});
  });

  it('should return null when there is no pendencies', () => {
    const mockFunction = jest.fn().mockReturnValue('message');

    I18n.t = mockFunction;

    const mockedPendencies = {
      ideal: [] as Pendency[],
      delayed: [] as Pendency[],
    };

    const message = buildMessage(mockedPendencies as CategorizedPendencies);

    expect(mockFunction).not.toBeCalledWith('notification.delayedStart');
    expect(mockFunction).not.toBeCalledWith('notification.idealStart');
    expect(mockFunction).not.toBeCalledWith('notification.idealEnd');
    expect(mockFunction).not.toBeCalledWith('notification.tapAction');
    expect(message).toBe(null);
  });
});
