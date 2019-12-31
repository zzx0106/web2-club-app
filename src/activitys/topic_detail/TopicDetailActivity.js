import React from 'react';
import { Text, FlatList, KeyboardAvoidingView, TextInput, ScrollView, StyleSheet, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import ButtonContainer from '../../widgets/Touch';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import RepliesItem from '../../widgets/RepliesItem';
import { WebView } from 'react-native-webview';
import LottieView from 'lottie-react-native';
import { Tab, Tabs, ScrollableTab, Button, Toast } from 'native-base';
import { api_getTopicDetail, api_replie, api_login, api_getTopic } from '../../api/api';
class TopicDetailActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams } = navigation;
        const { params } = navigation.state;
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
            // headerLeft: (
            //     <ButtonContainer style={{ marginLeft: PX(10) }} onPress={() => console.log(navigation.goBack())}>
            //         <Icon name="return" size={24} color={'#fff'} />
            //     </ButtonContainer>
            // ),
            headerRight: (
                <ButtonContainer
                    style={{ marginRight: PX(20) }}
                    onPress={() => {
                        console.log('right');
                    }}
                >
                    <Icon name="switch" size={24} color={'#fff'} />
                </ButtonContainer>
            ),
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            topic: {},
            WebViewHeight: 0, // webview高度
            user_id: '',
            user_nickname: '',
            user_avatar: '',
            text: '',
            reply_user: '',
            height: 0,
            width: 0,
            hidBottom: false,
        };
        this.user = {};
    }
    async componentWillMount() {
        console.log('this is topic detail activity');
        const user = await getStorage('user');
        console.log('user', user);
        this.user = user;
        const { params } = this.props.navigation.state;
        const topic = await api_getTopicDetail({ id: params.topic_id });
        console.log('topic...', topic, user);
        if (topic.data && topic.data.data) {
            this.setState({
                topic: topic.data.data,
                user_id: user._id,
                user_nickname: user.nickname,
                user_avatar: user.avatar,
            });
        }
        this.webview.injectJavaScript(`window.viewType = 1`);
    }
    onMessage = async (e) => {
        console.log(e.nativeEvent.data);
        try {
            let data = JSON.parse(e.nativeEvent.data);
            if (data.type === 'HEIGHT') {
                let height = data.data.height || 0;
                height = parseInt(height, 0);
                console.log('height ---------', height);
                this.setState({
                    WebViewHeight: height + 20,
                });
            }
        } catch (error) {
            console.log('onMessage error', error);
        }
    };
    onLoadStart = (e) => {
        console.log('onLoadStart start');
    };
    onWVLoad = (e) => {
        console.log('onWVL onWVLoad', this.state.topic);
        this.webview.injectJavaScript(`WV_viewType('${1}')`);
        this.webview.injectJavaScript(`WV_renderHtml(${JSON.stringify(this.state.topic)})`);
    };
    onWVLoadEnd = (e) => {
        console.log('onWVLE123', e);
    };
    onNavigationStateChange = (e) => {
        console.log('onNavigationStateChange', e);
    };
    onUped = (index) => {
        if (Object.keys(this.user) > 0) {
            const { topic } = this.state;
            const { _id } = this.user;
            if (Object.keys(topic).length > 0) {
                let ups = topic.replies[index].ups;
                if (ups.indexOf(_id)) {
                    topic.replies[index].ups.remove(_id);
                    topic.replies[index].is_upted = true;
                } else {
                    topic.replies[index].ups.push(_id);
                    topic.replies[index].is_upted = false;
                }
                this.setState({
                    topic,
                });
            }
        } else {
            Toast('请先登录');
            setTimeout(() => this.navigation.navigate('UserLoginActivity'), 3000);
        }
    };
    onChangeSize = (event) => {
        console.log(event.nativeEvent.contentSize.height);
        this.setState({
            height: event.nativeEvent.contentSize.height,
        });
    };
    onChangeText = (text) => {
        this.setState({
            text: text,
        });
    };
    openInput = () => {
        console.log('点击');
        this.setState(
            {
                hidBottom: true,
            },
            () => this.input.focus()
        );
    };
    onFocus = () => {};
    onBlur = () => {
        this.setState({
            hidBottom: false,
        });
    };
    onSubmit = async () => {
        // let text = this.state.text;
        let { text, topic, user_id, user_nickname, user_avatar } = this.state;
        if (!text.replace(/(^\s*)|(\s*$)/g, '')) {
            Toast('输入不能为空');
            return;
        }
        const replie = await api_replie(topic.id, {
            content: `<p>${text}</p>`,
        });
        if (replie.data.msg === 'ok') {
            console.log({
                id: user_id,
                nickname: user_nickname,
                avatar: user_avatar,
            });
            console.log('befor', topic);
            topic.replies.push({
                author: {
                    nickname: user_nickname,
                    avatar: user_avatar,
                },
                id: user_id,
                content: `<p>${text}</p>`,
                create_at: new Date(),
                ups: [],
            });
            console.log('after', topic);
            this.setState(
                {
                    // topic: JSON.parse(JSON.stringify(topic)),
                    topic,
                    text: '',
                },
                () => this.input.blur() // 失去焦点
            );
        } else {
            Toast(replie.data.rspinf);
        }

        console.log('replie', replie);
    };
    render() {
        const { topic, user_id, hidBottom } = this.state;
        let inputHeight = Math.max(30, this.state.height);
        console.log('input height', inputHeight);
        if (inputHeight > 69) {
            inputHeight = 69;
        }
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <ScrollView style={{ flex: 1 }}>
                    <WebView
                        ref={(ref) => (this.webview = ref)}
                        source={{
                            uri: 'http://10.8.2.171:8080/',
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
                        // scalesPageToFit={true}
                        originWhitelist={['*']}
                        renderError={(e) => {
                            console.log('render Error');
                        }}
                        mixedContentMode={'always'}
                        automaticallyAdjustContentInsets={true}
                        allowUniversalAccessFromFileURLs={true}
                        mediaPlaybackRequiresUserAction={true}
                        startInLoadingState={true}
                        style={[{ width: WIDTH, flex: 0, height: parseInt(this.state.WebViewHeight) === 0 ? 300 : parseInt(this.state.WebViewHeight) }]}
                        scrollEnabled={false}
                    />
                    <View style={{ marginBottom: PX(80) }}>
                        <Text style={styles.replies}>全部评论</Text>
                        <FlatList
                            style={{ width: WIDTH }}
                            data={topic.replies || []}
                            initialNumToRender={10}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(props) => {
                                return <RepliesItem userId={user_id} onUped={this.onUped} {...props} {...this.props} />;
                            }}
                        />
                    </View>
                </ScrollView>
                {hidBottom ? (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: WIDTH,
                            minHeight: PX(90),
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopWidth: PX1,
                            backgroundColor: '#fff',
                            borderTopColor: 'rgba(0,0,0,0.3)',
                        }}
                    >
                        <KeyboardAvoidingView style={styles.inputBox}>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        height: PX(60),
                                    },
                                ]}
                                ref={(input) => (this.input = input)}
                                multiline={true}
                                placeholder="发表评论..."
                                underlineColorAndroid="transparent"
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                onContentSizeChange={this.onChangeSize}
                                maxLength={200}
                                value={this.state.text}
                                onChangeText={this.onChangeText}
                            />
                            <ButtonContainer onPress={this.onSubmit}>
                                <View style={{ width: PX(100), height: PX(60), color: '#395581', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>发布</Text>
                                </View>
                            </ButtonContainer>
                        </KeyboardAvoidingView>
                    </View>
                ) : (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: WIDTH,
                            minHeight: PX(90),
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopWidth: PX1,
                            borderTopColor: 'rgba(0,0,0,0.3)',
                            backgroundColor: '#fff',
                        }}
                    >
                        <ButtonContainer
                            onPress={this.openInput}
                            style={{ flex: 1, marginLeft: PX(20), backgroundColor: '#EFEFEF', flexDirection: 'row', alignItems: 'center', paddingLeft: PX(20), height: PX(60), borderRadius: PX(30) }}
                        >
                            <Text style={{ height: PX(60), lineHeight: PX(60), borderRadius: PX(30), flex: 1, color: '#BDBDBD' }}>请输入评论</Text>
                        </ButtonContainer>
                        <View style={{ width: PX(200), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <ButtonContainer style={{ alignItems: 'center' }}>
                                <Icon name="praise" size={PX(50)} color="#BDBDBD" />
                            </ButtonContainer>
                            <ButtonContainer style={{ alignItems: 'center' }}>
                                <Icon name="like" size={PX(50)} color="#BDBDBD" />
                            </ButtonContainer>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    replies: {
        marginLeft: PX(24),
        fontSize: TEXT(24),
        color: '#000',
    },
    inputBox: {
        flex: 1,
        minHeight: PX(60),
        marginTop: PX(15),
        marginBottom: PX(15),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        // minHeight: PX(30),
        // borderTopRightRadius: PX(30),
        // borderBottomRightRadius: PX(30),
        // paddingRight: PX(0),
        // paddingTop: PX(0),
        // paddingBottom: PX(0),
        // marginLeft: PX(5),
    },
    input: {
        flex: 1,
        marginLeft: PX(20),
        backgroundColor: '#EFEFEF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: PX(20),
        borderRadius: PX(30),
        paddingVertical: 0, //解决TextInput文字不垂直居中的问题
        // minHeight: PX(30),
        // borderTopRightRadius: PX(30),
        // borderBottomRightRadius: PX(30),
        // paddingRight: PX(0),
        // paddingTop: PX(0),
        // paddingBottom: PX(0),
        // marginLeft: PX(5),
    },
});
export default TopicDetailActivity;
