import React from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import ButtonContainer from '../../widgets/Touch';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { WebView } from 'react-native-webview';
import _axios from 'axios';
import ajax from './ajax';
import * as qiniu from 'qiniu-js';
import { Tab, Tabs, ScrollableTab, Button } from 'native-base';
import { api_getTopicDetail, api_qiniu_token, api_login, api_getTopic } from '../../api/api';
class TopicCreateActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        const defalut = {
            // 这个地方会最先运行，给个默认值
            onUndo: () => {},
            onRedo: () => {},
            onSubmit: () => {},
        };
        const { params = defalut } = navigation.state;
        console.log('TopicCreateActivity', params);
        return {
            headerTitleStyle: {
                color: 'white',
                marginLeft: PX(0),
            },
            headerStyle: {
                backgroundColor: THEME.blue,
                height: PX(70),
                shadowOpacity: 0,
                elevation: 0,
                borderBottomWidth: 0,
            },
            headerLeft: (
                <ButtonContainer style={{ marginLeft: PX(10) }} onPress={() => console.log(navigation.goBack())}>
                    <Icon name="return" size={24} color={'#fff'} />
                </ButtonContainer>
            ),
            headerRight: (
                <View style={styles.headerRight}>
                    <ButtonContainer onPress={params.onUndo}>
                        <Icon name="undo" size={24} color={'#fff'} />
                    </ButtonContainer>
                    <ButtonContainer onPress={params.onRedo}>
                        <Icon style={{ transform: [{ rotateY: '180deg' }], marginLeft: PX(25) }} name="undo" size={24} color={'#fff'} />
                    </ButtonContainer>
                    <ButtonContainer onPress={params.onSubmit}>
                        <Text style={{ color: '#fff', marginLeft: PX(25), marginRight: PX(25) }}>发表</Text>
                    </ButtonContainer>
                </View>
            ),
        };
    };
    state = {};
    async componentWillMount() {
        try {
            const { params } = this.props.navigation.state;
            // const topic = await api_getTopicDetail({ id: params.topic_id });
            // 将事件注入到navigation头部
            this.props.navigation.setParams({
                onRedo: this.onRedo,
                onUndo: this.onUndo,
                onSubmit: this.onSubmit,
            });
            // this.webview.postMessage('jbk');
        } catch (error) {
            console.warn('topic create activity error', error);
        }
    }
    onMessage = async (e) => {
        console.log(e.nativeEvent.data);
        console.log(e.nativeEvent.data);
        try {
            let data = JSON.parse(e.nativeEvent.data);
            console.log('datadatadatadata,', data);
            if (data.type === 'QN_TOKEN') {
                let res = await api_qiniu_token();
                let token = res.data.data.uploadToken;
                console.log('token --->', token);
                this.webview.injectJavaScript(`WV_qiniuToken('${token}')`);
            }
        } catch (error) {
            console.log('onMessage error', error);
        }
    };
    dataURItoBlob = (dataURI) => {
        let byteString = atob(dataURI.split(',')[1]);
        let mimeString = dataURI
            .split(',')[0]
            .split(':')[1]
            .split(';')[0];
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };
    /**
     * base64 -> file
     * @param dataurl base64
     * @param filename
     */
    dataURLtoFile = (dataurl, filename) => {
        //将base64转换为文件
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
    onLoadStart = (e) => {
        if (this.webview) this.webview.injectJavaScript(`window.viewType = 0`);
    };
    onWVLoad = (e) => {
        console.log('onWVL', e);
    };
    onWVLoadEnd = (e) => {
        console.log('onWVLE', e);
    };
    onNavigationStateChange = (e) => {
        console.log('onNavigationStateChange', e);
    };
    onSubmit = () => {
        console.log('提交');
        if (this.webview) this.webview.injectJavaScript(`WV_getHtml()`); // postMessage 在以后的版本会被移除
    };
    onUndo = () => {
        console.log('后撤');
        if (this.webview) this.webview.injectJavaScript(`WV_undo()`);
    };
    onRedo = () => {
        console.log('前撤');
        if (this.webview) this.webview.injectJavaScript(`WV_redo()`);
    };
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                {/* <KeyboardAvoidingView style={{ flex: 1 }}> */}
                    <WebView
                        ref={(ref) => (this.webview = ref)}
                        source={{
                            uri: 'http://10.8.2.171:8080',
                            // uri: 'file:///android_asset/webview/index.html',
                            // uri: 'http://10.8.2.171:8082',
                            // baseUrl: 'file:///android_asset/webview/'
                            // uri: 'file:///android_asset/webview/richeditor.html',
                        }}
                        allowFileAccess={true} // 设置是否WebView有权访问文件系统
                        onNavigationStateChange={this.onNavigationStateChange}
                        onMessage={this.onMessage}
                        onLoadStart={this.onLoadStart}
                        useWebKit={true} // 设置true的时候会使用新的WKWebView来代替老的UIWebView。
                        onLoad={this.onWVLoad}
                        onError={this.onWVLoadEnd}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={['*']}
                        // scalesPageToFit={Platform.OS === 'ios' ? false : true}
                        renderError={(e) => {
                            console.log('render Error');
                        }}
                        mixedContentMode={'always'}
                        automaticallyAdjustContentInsets={true}
                        allowUniversalAccessFromFileURLs={true}
                        mediaPlaybackRequiresUserAction={true}
                        startInLoadingState={true}
                        style={[{ width: WIDTH }, { flex: 1 }]}
                    />
                {/* </KeyboardAvoidingView> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export default TopicCreateActivity;
