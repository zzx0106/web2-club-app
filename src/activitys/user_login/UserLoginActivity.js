import React from 'react';
import { Text, FlatList, ScrollView, StyleSheet, KeyboardAvoidingView, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab, Form, Item, Input, Label, Button } from 'native-base';
import { api_getKey, api_login } from '../../api/api';
import LottieView from 'lottie-react-native';
import Kohana from '../../widgets/InputKohana';
import { connect } from 'react-redux';
import { rx_login } from '../../store/actions/index';

@connect(
    (state) => state,
    (dispatch) => ({
        store_login(userInfo) {
            dispatch(rx_login(userInfo));
        },
    })
)
class UserLoginActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <Text>登录</Text>,
    });
    state = {
        email: '',
        password: '',
    };
    login = async () => {
        try {
            const { email, password } = this.state;
            if (!!!email && !!!password) {
                Toast('账号或密码不能为空！');
                return;
            }
            let key = await api_getKey();
            if (key.data.data) key = key.data.data.key;
            if (key) {
                let user = await api_login(
                    {
                        email,
                        password,
                    },
                    key
                );
                console.log('user', user);
                if (user.data.msg === 'err') {
                    Toast(user.data.rspinf, 'bottom');
                    return;
                }
                if (user.data.data) user = user.data.data;
                await setStorage('user', user, 1000 * 60 * 60 * 24 * 7); // 缓存7天
                this.props.store_login(user);
                Toast('登录成功', 'bottom');
                this.props.navigation.popToTop(); // 回到顶层
            } else {
                Toast('获取秘钥失败，可以尝试更换网络，或联系管理员');
                return;
            }
        } catch (error) {
            Toast(`登录失败 ${error.name} : ${error.message}`);
        }
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                {/* <View style={{ width: WIDTH - PX(40), height: PX(80) }}> */}
                <ScrollView>
                    <KeyboardAvoidingView>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView style={styles.lottie1} autoPlay loop source={require('../../lottie/ex-splash.json')} />
                            {/* <LottieView style={{ width: PX(520), height: PX(390) }} autoPlay loop source={require('../../lottie/welcome.json')} /> */}
                            <Kohana onChangeText={(email) => this.setState({ email })} label={'请点击输入邮箱'} iconName={'mail'} />
                            <Kohana onChangeText={(password) => this.setState({ password })} expandStyle={{ marginTop: PX(15) }} label={'请输入密码'} secureTextEntry iconName={'unlock'} />
                            <Button onPress={this.login} style={{ width: WIDTH - PX(40), height: PX(60), alignItems: 'center', justifyContent: 'center', marginTop: PX(30) }} info>
                                <Text style={{ color: '#fff' }}>登录</Text>
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                {/* </View> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    lottie1: { width: WIDTH - PX(40), height: ((WIDTH - PX(40)) * 37) / 74, marginTop: PX(30) },
});
export default UserLoginActivity;
