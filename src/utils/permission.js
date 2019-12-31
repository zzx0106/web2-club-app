import { PermissionsAndroid } from 'react-native';

async function requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: '申请摄像头权限',
            message: '一个很牛逼的应用想借用你的摄像头，' + '然后你就可以拍出酷炫的皂片啦。',
            buttonNeutral: '等会再问我',
            buttonNegative: '不行',
            buttonPositive: '好吧',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('现在你获得摄像头权限了');
        } else {
            console.log('用户并不屌你');
        }
    } catch (err) {
        console.warn(err);
    }
}

global.requestCameraPermission = requestCameraPermission;
