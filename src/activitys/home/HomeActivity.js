import React from 'react';
import { Text, FlatList, StyleSheet, Picker, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import ListItem from '../../widgets/ListItem';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab, Toast, Button } from 'native-base';
import { api_getKey, api_login, api_getTopic, set_navigation, api_allTabs } from '../../api/api';
import { connect } from 'react-redux';
import { rx_user } from '../../store/actions/index';
import ButtonContainer from '../../widgets/Touch';
@connect(
    (state) => state,
    (dispatch) => ({
        store_user() {
            dispatch(rx_user());
        },
    })
)
class HomeActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '首页',
    });
    state = {
        topicList: [],
        tabList: [],
        refreshing: false, // 控制列表刷新
        classType: 'hot',
    };
    openFloatBtn = () => {
        try {
            console.log(this, this.props.navigation.navigate);
            this.props.navigation.navigate('FunActivity');
        } catch (error) {
            console.log('err', error);
        }
    };
    async componentWillMount() {
        try {
            set_navigation(this.props.navigation);
            this.props.store_user(); // 同步用户登录状态
            this.getTopic();
        } catch (error) {
            console.log(error);
        }
    }
    getTopic = async (tab = 'all') => {
        try {
            let topic = await api_getTopic({
                tab,
            });
            this.setState({
                topicList: topic.data.data,
            });
            console.log('topic-------', topic);
        } catch (error) {
            conosle.log('getTopic error', error);
            Toast('获取列表失败');
        }
    };
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
    onChangeTab = async (tab) => {
        console.log(tab);
        try {
            const { i, from } = tab;
            if (i === 0) {
                await this.getTopic();
            } else if (i === 1) {
                const tabs = await api_allTabs();
                if (tabs.data.data && tabs.data.data.tabs) {
                    let tabArr = tabs.data.data.tabs;
                    // 默认按照热度排列
                    if (tabArr.length > 0) {
                        tabArr = tabArr.sort((o, n) => n.visit_count - o.visit_count);
                        console.log('排序后', tabArr);
                    }
                    this.setState({
                        tabList: tabArr,
                    });
                }
            } else if (i === 2) {
            }
        } catch (error) {
            console.log('onChangeTab error', error);
        }
    };
    listAdapter = (index) => {
        console.log('listAdapter', index);
        const { tabList, topicList } = this.state;
        if (index === 0) {
            return topicList;
        } else if (index === 1) {
            return tabList;
        } else if (index === 2) {
            // 过滤出other类型
            return topicList.filter((other) => other.tab.some((tb) => tb.name === 'other'));
        }
    };
    changClassType = (type) => {
        console.log('type', type);
        let tabList = this.state.tabList;
        if (type === 'hot') {
            tabList = tabList.sort((o, n) => n.visit_count - o.visit_count);
        } else if (type === 'time') {
            tabList = tabList.sort((o, n) => {
                return Date.parse(n.create_at) - Date.parse(o.create_at);
            });
        }
        console.log('tablist', tabList);
        this.setState({
            tabList,
            classType: type,
        });
    };
    navigateTo = (router, data) => {
        console.log('router', router);
        if (router === 'classify') {
            this.props.navigation.navigate('ClassifyActivity', data);
        }
    };
    render() {
        const { refreshing } = this.state;
        const navList = ['首页', '分类', '其他'];
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <Tabs
                    onChangeTab={this.onChangeTab}
                    tabBarPosition="top"
                    tabStyle={{ backgroundColor: THEME.blue }}
                    activeTabStyle={{ backgroundColor: THEME.blue }}
                    renderTabBar={() => <ScrollableTab style={{ height: PX(60), backgroundColor: THEME.blue }} tabsContainerStyle={{ backgroundColor: THEME.blue }} underlineStyle={{ backgroundColor: '#fff', height: PX(0.1) }} />}
                >
                    {navList.map((tab, index) => {
                        return (
                            <Tab heading={tab} key={tab} tabStyle={styles.tabStyle} textStyle={styles.textStyle} activeTextStyle={styles.activeTextStyle} activeTabStyle={styles.activeTabStyle}>
                                {index === 1 && (
                                    <View style={styles.topPicker}>
                                        <Picker
                                            mode="dropdown" // 向下拉的模式
                                            selectedValue={this.state.classType}
                                            style={{ height: PX(60), width: PX(170), fontSize: TEXT(20) }}
                                            onValueChange={(itemValue, itemIndex) => this.changClassType(itemValue)}
                                        >
                                            <Picker.Item label="按热度" value="hot" />
                                            <Picker.Item label="按时间" value="time" />
                                        </Picker>
                                    </View>
                                )}
                                <FlatList
                                    style={{ marginBottom: PX(100) }} // 防止底部footer遮挡
                                    data={this.listAdapter(index)}
                                    initialNumToRender={10}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(props) => {
                                        if (index === 0 || index === 2) {
                                            return <ListItem {...props} {...this.props} />;
                                        } else if (index === 1) {
                                            const { item: tab, index: tabIndex } = props;
                                            return (
                                                <ButtonContainer onPress={() => this.navigateTo('classify', tab)}>
                                                    <View style={styles.classBox}>
                                                        <View style={styles.header}>
                                                            <Text style={styles.classTitle}>{tab.name}</Text>
                                                            <Text style={styles.classSubTitle}>{tab.topic_ids.length}篇文章</Text>
                                                        </View>
                                                        <Text style={styles.classContent}>{tab.content || '该语言暂无简介'}</Text>
                                                        <Text style={styles.classCreate}>创建于：{Format.dateBefor(tab.create_at)}</Text>
                                                    </View>
                                                </ButtonContainer>
                                            );
                                        }
                                    }}
                                    onRefresh={this.onRefresh}
                                    onEndReached={this.onEndReached} // 如果直接 this.props.query() 会请求两次
                                    onEndReachedThreshold={0.01} //貌似只有到这里才能滑到底部加载一次
                                    refreshing={refreshing}
                                />
                            </Tab>
                        );
                    })}
                </Tabs>
                <FloatBtn onPress={this.openFloatBtn}>
                    <Icon name="discover" size={PX(30)} color="#fff" />
                </FloatBtn>
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
export default HomeActivity;
