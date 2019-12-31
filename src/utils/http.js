import axios from 'axios';
import config from '../config/config';
import { encryptionDatagram, decryptionDatagram } from './tools';
const { baseClientURL, withCredentials } = config.axios_config;
let _key = '';
let _navigation = null;
// 创建接口连接实例
let axiosInstance = axios.create({
    baseURL: baseClientURL,
    timeout: 10000,
    withCredentials, //带cookie
    headers: {
        Accept: 'application/json, text/javascript, */*',
        'Content-Type': 'application/json;charset=utf-8',
    },
});
// 超时时间 http请求拦截器
axiosInstance.interceptors.request.use(
    async (config) => {
        const user = await getStorage('user');
        if (user && user.token) {
            config.headers.Authorization = user.token;
        }
        console.log('config--->', config);
        if (_key) {
            // post统一加密处理
            console.log('config---?', encryptionDatagram(JSON.parse(config.data), _key), '_key:', _key);
            config = {
                ...config,
                data: { med: encryptionDatagram(JSON.parse(config.data), _key) },
            };
            _key = '';
        }
        return config;
    },
    (error) => {
        _key = '';
        // console.error({ content: '加载超时', duration: 3 });
        return Promise.reject(error);
    }
);
// http响应拦截器
axiosInstance.interceptors.response.use(
    (data) => {
        if (_key) {
            _key = '';
        }
        console.log('config<-----', data);
        return data;
    },
    (error) => {
        _key = '';
        // console.error({ content: '响应超时', duration: 3, error });
        console.log('status', error.response.status);
        if (error.response.status === 401) {
            if (_navigation) _navigation.navigate('UserLoginActivity');
        }
        return Promise.reject(error);
    }
);

export function get(url) {
    return axiosInstance.get(url);
}
export function post(url, body, key = _key) {
    _key = key;
    return axiosInstance.post(url, JSON.stringify(body));
}
export function setNavigation(navigation) {
    _navigation = navigation;
}
