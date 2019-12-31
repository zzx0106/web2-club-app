import React from 'react';
import { Text, FlatList, StyleSheet, Picker, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import ListItem from '../../widgets/ListItem';
import BaseActivity from '../../base/BaseActivity';
import { api_getSelfTopics } from '../../api/api';
class MyTopicsActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '首页',
    });
    state = {
        topicList: [],
        refreshing: false, // 控制列表刷新
    };
    async componentWillMount() {
        try {
            const topics = await api_getSelfTopics();
            console.log('topics', topics);
            if (topics.data.data) {
                this.setState({
                    topicList: topics.data.data,
                });
            }
            // set_navigation(this.props.navigation);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 下拉刷新
     */
    onRefresh = () => {
        // const { tab } = this.props;
        // this.initData(tab);
        console.log('刷新');
    };
    /**
     * 上滑加载
     */
    onEndReached = () => {
        console.log('加载');

        // const { tab } = this.props;
        // const { page } = this.state;
        // if (this.state.data.length > 0) {
        //     let nextPage = page + 1;
        //     this.setState({
        //         page: nextPage,
        //     });
        //     this.moreData(nextPage, tab);
        // }
    };

    render() {
        const { topicList, refreshing } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <FlatList
                    style={{ marginBottom: PX(100) }} // 防止底部footer遮挡
                    data={topicList}
                    initialNumToRender={10}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(props) => <ListItem {...props} {...this.props} />}
                    onRefresh={this.onRefresh}
                    onEndReached={this.onEndReached} // 如果直接 this.props.query() 会请求两次
                    onEndReachedThreshold={0.01} //貌似只有到这里才能滑到底部加载一次
                    refreshing={refreshing}
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
    topPicker: {
        height: PX(80),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        paddingLeft: PX(15),
    },
    activeTextStyle: {
        color: '#fff',
        fontWeight: '400',
    },
    activeTabStyle: {
        backgroundColor: THEME.blue,
    },
    classBox: {
        marginLeft: PX(18),
        marginRight: PX(18),
        marginBottom: PX(10),
        paddingTop: PX(8),
        paddingLeft: PX(8),
        paddingBottom: PX(8),
        paddingRight: PX(8),
        borderBottomWidth: PX1,
        borderColor: '#efefef',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classTitle: {
        fontSize: TEXT(30),
        fontWeight: '400',
        color: '#2e2e2e',
    },
    classSubTitle: {
        fontSize: TEXT(19),
        color: THEME.blue,
        borderRadius: PX(5),
        marginLeft: PX(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    classContent: {
        fontSize: TEXT(24),
        marginTop: PX(5),
        marginBottom: PX(5),
        color: '#666',
    },
    classCreate: {
        fontSize: TEXT(18),
        color: '#666',
    },
});
export default MyTopicsActivity;
