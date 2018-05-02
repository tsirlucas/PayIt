import {CategorizedPendencies, Pendency} from 'models';

import {mockedPendency, mockedPendency2, mockedPendency3, mockedUser} from '../../../__mocks__';
import {I18n} from '../../i18n';
import {buildMessage, categorizePendencies} from './notification';

describe('categorizePendencies', () => {
  it('should return categorized pendencies', () => {
    const mockedUserPendencies = {
      id: mockedUser.uid,
      data: {
        [mockedPendency.id]: {...mockedPendency, type: 'NEXT'},
        [mockedPendency2.id]: {...mockedPendency2, type: 'IDEAL'},
        [mockedPendency3.id]: {...mockedPendency3, type: 'DELAYED'},
      },
    };

    const result = categorizePendencies(mockedUserPendencies);

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
      delayed: [{...mockedPendency, type: 'DELAYED'}],
      ideal: [{...mockedPendency2, type: 'IDEAL'}],
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
          ...mockedPendency2,
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
          ...mockedPendency2,
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
