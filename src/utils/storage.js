/**
 * 缓存处理
 */
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
const defaultExpires = null;
const storage = new Storage({
    //最大容量，默认值1000条数据循环存储
    size: 1000,

    //存储引擎：RN使用AsyncStorage
    //如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    //数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires,

    //读写时在内存中缓存数据，默认开启
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // 或是写到另一个文件里，这里require引入
});

// global.storage = storage;
/**
 *
 * @param {String} key      //缓存的键
 * @param {Object} value    //缓存的对象
 * @param {String} expires  //缓存的时间
 * @returns {Promise}
 */
const setStorage = (key, value, expires = defaultExpires) => {
    if (key && key.indexOf('_') > -1) {
        console.warn('setStorage error : key中禁止使用 “_” 符号');
        return;
    }
    return storage.save({
        key,
        data: value,
        expires,
    });
};
const getStorage = (key) => {
    return new Promise((res, rej) => {
        if (key && key.indexOf('_') > -1) {
            console.warn('getStorage error : key中禁止使用 “_” 符号');
            res('');
        }
        storage
            .load({
                key,
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: true,

                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                syncInBackground: true,
                // 你还可以给sync方法传递额外的参数
                syncParams: {
                    extraFetchOptions: {
                        // 各种参数
                    },
                    someFlag: true,
                },
            })
            .then((value) => {
                res(value);
            })
            .catch((err) => {
                console.warn('getStorage err ------>', err.name, err.message);
                switch (err.name) {
                    case 'NotFoundError': // 没有找到
                        res('');
                        break;
                    case 'ExpiredError': // 数据过期
                        removeStorage('user');
                        res('');
                        break;
                }
            });
    });
};
const removeStorage = (key) => {
    if (key && key.indexOf('_') > -1) {
        console.warn('removeStorage error : key中禁止使用 “_” 符号');
        return '';
    }
    return storage.remove({
        key,
    });
};
//同步远程数据（刷新）
storage.sync = {
    // sync方法的名字必须和所存数据的key完全相同
    // 方法接受的参数为一整个object，所有参数从object中解构取出
    // 这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject。
    // xxx(params) {
    // },
};
global.setStorage = setStorage;
global.getStorage = getStorage;
global.removeStorage = removeStorage;
