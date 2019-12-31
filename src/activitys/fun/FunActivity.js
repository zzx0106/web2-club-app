import React from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab, Button } from 'native-base';
import { api_getKey, api_login, api_getTopic } from '../../api/api';
import LottieView from 'lottie-react-native';
class FunActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '趣味',
    });
    state = {};

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} />
                <Text>趣味</Text>
                <Button
                    onPress={() => {
                        // this.asyncMethod(() => {
                        this.dom.play(0, 21); // 播放动画开始时间，结束时间
                        this.dom2.play(0, 42);
                        this.dom3.play(0, 72);
                        // });
                    }}
                >
                    <Text>点击</Text>
                </Button>
                <LottieView source={require('../../lottie/success_1.json')} loop={false} ref={(dom) => (this.dom = dom)} style={{ position: 'absolute', top: PX(100), width: PX(400), height: PX(300) }} />
                <LottieView source={require('../../lottie/success_2.json')} loop={false} ref={(dom) => (this.dom2 = dom)} style={{ position: 'absolute', top: PX(200), width: PX(400), height: PX(300) }} />
                <LottieView source={require('../../lottie/success_3.json')} loop={false} ref={(dom) => (this.dom3 = dom)} style={{ position: 'absolute', top: PX(300), width: PX(400), height: PX(300) }} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tabStyle: {
        backgroundColor: THEME.blue,
    },
    textStyle: {
        fontSize: TEXT(12),
        marginBottom: PX(10),
        marginTop: PX(10),
        fontWeight: '400',
        color: '#fff',
    },
    activeTextStyle: {
        color: '#fff',
        fontWeight: '400',
    },
    activeTabStyle: {
        backgroundColor: THEME.blue,
    },
});
export default FunActivity;
