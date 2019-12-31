import React from 'react';
import { Text, FlatList, Modal, StyleSheet, Alert, TouchableHighlight, Image, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab, Button } from 'native-base';
import { api_getKey, api_login, api_getTopic, api } from '../../api/api';
import ListIconItem from '../../widgets/ListIconItem';
import ButtonContainer from '../../widgets/Touch';
import { connect } from 'react-redux';
import { rx_user, rx_logout } from '../../store/actions/index';
@connect(
    (state) => state,
    (dispatch) => ({
        store_logout() {
            dispatch(rx_logout());
        },
    })
)
class MySettingActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: <Text style={{ color: '#fff' }}>设置</Text>,
    });
    state = {};
    componentWillMount() {}
    navigateTo = (type) => {
        console.log(type);
    };
    logout = () => {
        // 登出
        Alert.alert(
            '确认退出', // 标题
            '退出后会删除您的个人信息！', // 主体
            [
                {
                    text: '确认退出', // 按钮左
                    onPress: () => {
                        this.props.store_logout();
                        this.navigation.Pop();
                    },
                },
                {
                    text: '取消', // 按钮右
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false }
        );
    };
    render() {
        console.log('user', this.props);
        const { user_info } = this.props.user;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <ButtonContainer style={styles.item} onPress={() => this.navigateTo('clear')}>
                    <View style={styles.itemPadding}>
                        <Text>清除缓存</Text>
                    </View>
                </ButtonContainer>
                <ButtonContainer style={styles.item} onPress={() => this.navigateTo('about')}>
                    <View style={styles.itemPadding}>
                        <Text>关于web2club</Text>
                    </View>
                </ButtonContainer>
                <ButtonContainer onPress={this.logout}>
                    <View style={styles.logout}>
                        <Text style={{ color: '#FB3535' }}>退出</Text>
                    </View>
                </ButtonContainer>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    logout: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: PX(80),
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        paddingLeft: PX(24),
        paddingRight: PX(24),
        backgroundColor: '#fff',
    },
    itemPadding: {
        flexDirection: 'row',
        height: PX(80),
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: PX(1),
        borderColor: '#f0f0f0',
    },
});
export default MySettingActivity;
