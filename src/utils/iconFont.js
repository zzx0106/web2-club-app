import { createIconSetFromIcoMoon, createIconSet } from 'react-native-vector-icons';
import iconConfig from './iconfont.json';
// const Icon = createIconSetFromIcoMoon(iconConfig);
const Icon = createIconSet(iconConfig, 'Icon', 'iconfont.ttf');
export default Icon;
