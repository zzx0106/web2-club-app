import React from 'react';
import { Text, FlatList, StyleSheet, TextInput, Picker, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import { api_getFollowing } from '../../api/api';
import ButtonContainer from '../../widgets/Touch';
import ListItem from '../../widgets/ListItem';
import ListUserItem from '../../widgets/ListUserItem';

class MyFollowingActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '搜索',
    });
    state = {
        historyList: [],
        text: '',
        search_type: 'topic',
        topicList: [], // 搜索到的数组
        userList: [],
    };
    async componentWillMount() {
        const followering = await api_getFollowing();
        console.log('followers', followering);
        if (followering.data.data && followering.data.data.followering) {
            this.setState({
                userList: followering.data.data.followering || [],
            });
        }
    }

    render() {
        const { userList } = this.state;
        return (
            <View style={{ flex: 1, paddingLeft: PX(24), paddingRight: PX(24) }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <FlatList
                    data={userList}
                    initialNumToRender={10}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(props) => {
                        return <ListUserItem {...props} {...this.props} />;
                    }}
                />
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
    inputBox: {
        height: PX(70),
        marginTop: PX(35),
        paddingTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: PX1,
        borderColor: '#efefef',
        borderRadius: PX(8), //
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        backgroundColor: '#EFEFEF',
        height: PX(68),
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: PX(20),
        // borderRadius: PX(8),
        borderTopLeftRadius: PX(8),
        borderBottomLeftRadius: PX(8),
        paddingVertical: 0, //解决TextInput文字不垂直居中的问题
    },
    historyList: {
        height: PX(60),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#efefef',
        borderBottomWidth: PX1, //
    },
});
export default MyFollowingActivity;
