// import 'muse-ui/dist/muse-ui.css';
// import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
// import 'muse-ui-message/dist/muse-ui-message.css';
// import 'muse-ui/lib/styles/base.less';
// import 'muse-ui/lib/styles/theme.less';
// import 'muse-ui-progress/dist/muse-ui-progress.css';
import './assets/css/reset.scss';
import './assets/css/iconfont.scss';
import Vue from 'vue';
import App from './App.vue';
// import MuseUI from 'muse-ui';
// import Loading from 'muse-ui-loading';
// import Toast from 'muse-ui-toast';
// import Message from 'muse-ui-message';
// import NProgress from 'muse-ui-progress';
import Http from './utils/http';
import './utils/formate';
// import { Grid, Button, Divider, LoadMore, List, Icon, Paper, Progress, Helpers } from 'muse-ui';
Vue.config.productionTip = false;

// Vue.use(MuseUI); // muse ui
// Vue.use(NProgress); // muse ui 顶部进度条
// Vue.use(Message); // Message框
// Vue.use(Loading);
// Vue.use(Toast, {
//     position: 'top', // 弹出的位置
// });
// loadOnDemand(Vue); // 按需加载Muse ui 可节省大量空间
if (process.env.NODE_ENV !== 'production') {
    const vConsole = require('vconsole');
    Vue.prototype.Log = new vConsole();
}
Vue.prototype.$http = new Http(false, true);
new Vue({
    render: (h) => h(App),
}).$mount('#app');

function loadOnDemand(Vue) {
    Vue.use(Grid);
    Vue.use(Helpers);
    Vue.use(Button);
    Vue.use(List);
    Vue.use(Icon);
    Vue.use(Paper);
    Vue.use(Progress);
    Vue.use(Divider);
    Vue.use(LoadMore);
}
