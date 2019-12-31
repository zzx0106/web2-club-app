import { Dimensions, PixelRatio, StatusBar, Platform } from 'react-native';

let deviceWidth = Dimensions.get('window').width; // 360
let deviceHeight = Dimensions.get('window').height;

let fontScale = PixelRatio.getFontScale(); //返回字体大小缩放比例
let pixelRatio = PixelRatio.get(); //当前设备的像素密度
// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;
//px转换成dp
const defaultW = Platform.OS === 'ios' ? 750 : 720;
const defaultH = Platform.OS === 'ios' ? 1334 : 1280;
// 根据dp获取屏幕的px
let screenPxW = PixelRatio.getPixelSizeForLayoutSize(deviceWidth);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(deviceHeight);

const w2 = defaultW / pixelRatio;
const h2 = defaultH / pixelRatio;

// TODO这里应该是比较宽高，谁小取谁，原因是因为有横屏
const scale = Math.min(deviceHeight / h2, deviceWidth / w2); //获取缩放比例
function isIphoneX() {
    return Platform.OS === 'ios' && ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) || (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT));
}
//状态栏的高度
function statusBarHeight() {
    if (Platform.OS == 'android') return StatusBar.currentHeight;
    if (isIphoneX()) {
        return 44;
    }
    return 20;
}
/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
function TEXT(size) {
    var scaleWidth = deviceWidth / defaultW;
    var scaleHeight = deviceHeight / defaultH;
    var scale = scaleWidth;
    size = Math.round((size * scale) / fontScale + 0.5); // 0.5是防止精度丢失
    return size;
}
/**
 * 设置px
 * @param size  px
 * @returns {Number} dp
 */
function PX(size) {
    var screenSize = screenPxW;
    var defaultSize = defaultW;
    var scale = (size * screenSize) / defaultSize;
    size = Math.round(scale / pixelRatio + 0.5); // 0.5是防止精度丢失
    return size;
}

global.statusBarHeight = statusBarHeight;
global.isIphoneX = isIphoneX;

global.TEXT = TEXT;
global.PX = PX;

global.HEIGHT = deviceHeight;
global.WIDTH = deviceWidth;

global.THEME = {
    blue: '#649EFB',
    StatusBar: '#FFFFFF',
};

global.PX1 = 1 / PixelRatio.get();
