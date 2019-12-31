import axios from 'axios';
import config from '../config/config';
import Toast from 'muse-ui-toast';
import Api from './api';
// import { encryptionDatagram, decryptionDatagram } from './tools';
axios.defaults.withCredentials = true;
class Http extends Api {
    /**
     * @param {Boolean} Interceptor 拦截器是否开启
     * @param {Boolean} loading loding功能是否开启
     * @param {Object} extendConfig 拓展属性，可以添加uploadProgress或downloadProgress回调来监听上传或者下载进度
     */
    constructor(interceptor, loading, extendConfig = {}) {
        super();
        this.med = false; // 报文加密
        const { baseClientURL, timeout, withCredentials } = config.axios_config;
        let axiosInstance = axios.create({
            baseURL: baseClientURL,
            timeout,
            withCredentials, //带cookie
            headers: {
                Accept: 'application/json, text/javascript, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            ...extendConfig,
        });
        if (interceptor) {
            // http请求拦截器
            axiosInstance.interceptors.request.use(
                (config) => {
                    // 报文加密
                    // if (this.med) {
                    //     config = config.data
                    //         ? {
                    //               ...config,
                    //               data: { med: encryptionDatagram(JSON.parse(config.data), 'aes-256-cbc', this.key) },
                    //           }
                    //         : config;
                    //     return config;
                    // }
                    return config;
                },
                (error) => {
                    Toast.error(error.message || '请求失败');
                    return Promise.reject(error);
                }
            );
            // http响应拦截器
            axiosInstance.interceptors.response.use(
                (data) => {
                    // 报文解密
                    if (this.med) {
                        // decryptionDatagram(data.data)
                    }
                    return data.data;
                },
                (error) => {
                    if (error && error.response.status) {
                        switch (error.response.status) {
                            case 401:
                                error.message = '未授权，请登录';
                                /* 跳转登录页 */
                                // window.location.replace(location.origin + '/user/login');
                                break;
                            default:
                                error.message = '请求失败';
                        }
                    }
                    Toast.error(error.message || '请求失败');
                    return Promise.reject(error);
                }
            );
        }

        this.http = axiosInstance;
    }
    /**
     * @param {String} url 请求链接
     */
    get(url) {
        try {
            console.log('api get ' + url);
            return this.http.get(url);
        } catch (error) {}
    }
    /**
     * @param {String} url 请求链接
     * @param {Object} body 请求体
     * @param {Object} med 报文体是否加密Message encryption device
     */
    post(url, body, med = {}) {
        console.log('api post', url, body);
        const { is_med = false, key = '' } = med;
        this.med = is_med;
        this.key = key;
        return this.http.post(url, JSON.stringify(body));
    }
}
export default Http;
