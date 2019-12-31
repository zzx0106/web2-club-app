import React from 'react';
import { Text, FlatList, Linking, StyleSheet, Image, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab, Button } from 'native-base';
import { api_getKey, api_login, api_getTopic } from '../../api/api';
import ListIconItem from '../../widgets/ListIconItem';
import ButtonContainer from '../../widgets/Touch';
import { connect } from 'react-redux';
import { rx_user } from '../../store/actions/index';
@connect(
    (state) => state,
    (dispatch) => ({
        store_user() {
            dispatch(rx_user());
        },
    })
)
class MyActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '我的',
    });
    state = {};
    componentWillMount() {
        // 拉取用户信息
        this.props.store_user();
    }
    /**
     * @param {Number} type 跳转位置
     */
    navigateTo = async (type, data = {}) => {
        try {
            switch (type) {
                case 'login':
                    const { islogin } = this.props.user;
                    if (islogin) {
                        this.props.navigation.navigate('MyInfoActivity'); // 跳转编辑页面
                    } else {
                        this.props.navigation.navigate('UserLoginActivity');
                    }
                    break;
                case 'github':
                    let github = this.props.user.user_info.github;
                    if (github) {
                        const canOpen = await Linking.canOpenURL(github);
                        if (canOpen) {
                            await Linking.openURL(github);
                        } else {
                            Toast('不支持打开该链接');
                        }
                    } else {
                        Toast('暂未填写github地址');
                    }
                    break;
                case 'mytopic':
                    this.props.navigation.navigate('MyTopicsActivity');
                    break;
                case 'msgcenter':
                    Toast('施工中...');
                    break;
                case 'collection':
                    this.props.navigation.navigate('MyCollectionActivity', { name: data.name });
                    break;
                case 'followers':
                    this.props.navigation.navigate('MyFollowersActivity');
                    break;
                case 'following':
                    this.props.navigation.navigate('MyFollowingActivity');
                    break;
                case 'feedback':
                    Toast('施工中...');
                    break;
                case 'setting':
                    this.props.navigation.navigate('MySettingActivity');
            }
        } catch (error) {
            console.log('my activity navigation to error', error);
        }
    };
    render() {
        console.log('user', this.props);
        const { user_info } = this.props.user;
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <ButtonContainer onPress={() => this.navigateTo('login')}>
                    <View style={{ ...styles.item, paddingTop: PX(50), paddingBottom: PX(20) }}>
                        {user_info.avatar ? <Image source={{ uri: user_info.avatar }} style={styles.avatar} resizeMode="contain" /> : <Icon name="mine_fill" size={PX(100)} color={'#D0D0D0'} />}

                        <View style={{ marginLeft: PX(20) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '300', fontSize: TEXT(32), color: '#000' }}>{user_info.nickname ? user_info.nickname : '登录/注册'}</Text>
                                {user_info.level && <Text style={{ fontSize: TEXT(16), color: '#FABE3B' }}>{user_info.level}级大神</Text>}
                            </View>
                            <Text style={{ fontWeight: '300', fontSize: TEXT(20), color: '#9199a1' }}>{user_info.simple_message ? user_info.simple_message : '登录体验更多功能'}</Text>
                        </View>
                    </View>
                </ButtonContainer>
                <View style={{ marginTop: PX(15) }}>
                    <ListIconItem iconName="supply" text="积分" num={user_info.score} unit="分" />
                    <ListIconItem onPress={() => this.navigateTo('github')} iconName="github" text="github" other={user_info.github} />
                </View>
                <View style={{ marginTop: PX(15) }}>
                    <ListIconItem onPress={() => this.navigateTo('mytopic')} iconName="editor" text="我的文章" num={user_info.topic_count} unit="篇" />
                    <ListIconItem onPress={() => this.navigateTo('msgcenter')} iconName="remind" text="消息中心" num={0} unit="条" />
                    <ListIconItem onPress={() => this.navigateTo('collection', user_info)} iconName="collection" text="收藏话题" num={user_info.collect_topic_count} unit="条" />
                    <ListIconItem onPress={() => this.navigateTo('followers')} iconName="browse" text="我的关注" num={user_info.followers.length} unit="人" />
                    <ListIconItem onPress={() => this.navigateTo('following')} iconName="people1" text="我的粉丝" num={user_info.following.length} unit="人" noBorder />
                </View>
                <View style={{ marginTop: PX(15) }}>
                    <ListIconItem onPress={() => this.navigateTo('feedback')} iconName="mail" text="意见反馈" />
                    <ListIconItem onPress={() => this.navigateTo('setting')} iconName="setup" text="设置" />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    avatar: { width: PX(100), height: PX(100), borderRadius: PX(50) },
    item: { paddingLeft: PX(20), paddingRight: PX(24), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
});
export default MyActivity;
