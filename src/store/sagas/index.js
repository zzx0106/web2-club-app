import { call, put, take, takeEvery, select, join, fork } from 'redux-saga/effects';
// import { FETCH_START, FETCH_ERROR, FETCH_SUCCESS, GET, POST } from '../types/common';

// function* _fetch(action) {
//     console.log('asyncDataAction', action);
//     const { url = '', method = 'GET', data = {}, key = '' } = action.payload;
//     try {
//         // 这个就是传进来的method是啥就调用$http的那个方法
//         const fetchData = () => $http[method.toLocaleLowerCase()](url, data);
//         yield put({ type: FETCH_START });
//         const res = yield call(fetchData);
//         if (res.statusCode === 200) {
//             yield put({ type: FETCH_SUCCESS, data: res.data, code: res.statusCode, key });
//         } else {
//             yield put({ type: FETCH_ERROR, data: res, code: res.statusCode, key });
//         }
//     } catch (error) {
//         yield put({ type: FETCH_ERROR, error, key });
//     }
// }
function* getUser() {
    try {
        const user_info = yield select((state) => state.user_info);
        if (!user_info) {
            const user = yield call(getStorage, 'user');
            yield put({ type: 'LOGIN', payload: user });
        }
    } catch (error) {
        console.log('saga getuser err', error);
    }
}
function* logout() {
    try {
        const user_info = yield select((state) => state.user_info);
        if (!user_info) {
            const user = yield call(removeStorage, 'user');
            yield put({ type: 'AFTER_LOGOUT', payload: user });
        }
    } catch (error) {
        console.log('saga getuser err', error);
    }
}

function* rootSaga() {
    yield takeEvery('USER', getUser);
    yield takeEvery('LOGOUT', logout);
    // yield takeEvery(GET, _fetch);
    // yield takeEvery(POST, _fetch);
}
export default rootSaga;
