// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { sendError } from '../../../';
import { API, RequestOptions } from '../../../../api';
import { apiKeys2FAModal, apiKeysData, ApiKeysFetch } from '../actions';

const apiKeysOptions: RequestOptions = {
    apiVersion: 'barong',
};

export function* apiKeysSaga(action: ApiKeysFetch) {
    try {
        const apiKeys = yield call(API.get(apiKeysOptions), '/resource/api_keys');
        yield put(apiKeysData(apiKeys));
    } catch (error) {
        yield put(sendError(error, 'alert'));
    } finally {
        yield put(apiKeys2FAModal({active: false}));
    }
}
