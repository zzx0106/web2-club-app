import React from 'react';
import { Text, StyleSheet, ScrollView, Image, StatusBar, View } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import { api_getSelfCollect } from '../../api/api';
import ButtonContainer from '../../widgets/Touch';
import ListItem from '../../widgets/ListItem';
import { connect } from 'react-redux';
import { Hoshi, Sae } from 'react-native-textinput-effects';
import ListUserItem from '../../widgets/ListUserItem';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import InputSea from '../../widgets/InputSea';
@connect(
    (state) => state,
    (dispatch) => ({
        store_user() {
            dispatch(rx_user());
        },
    })
)
class MyInfoActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => {
        const defalut = {
            // 这个地方会最先运行，给个默认值
            onSubmit: () => {},
        };
        const { params = defalut } = navigation.state;
        return {
            headerTitle: <Text>编辑</Text>,
            headerRight: (
                <View style={styles.headerRight}>
                    <ButtonContainer onPress={params.onSubmit}>
                        <Icon name="right" size={24} color={'#fff'} />
                    </ButtonContainer>
                </View>
            ),
        };
    };
    state = {
        topicList: [],
        refreshing: false, // 控制列表刷新
    };
    async componentWillMount() {
        try {
            this.props.navigation.setParams({
                onSubmit: this.onSubmit,
            });
            const { params } = this.props.navigation.state;

            if (params && params.name) {
                const collect = await api_getSelfCollect(params.name);
                console.log('collect', collect);
                this.setState({
                    topicList: collect.data.data || [],
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
    onSubmit = () => {
        alert('submit');
    };
    render() {
        const { topicList, refreshing } = this.state;
        const { user_info } = this.props.user;
        console.log('user_info', user_info);
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <ScrollView>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Image source={{ uri: user_info.avatar }} style={styles.avatar} resizeMode="contain" />
                        <View style={{ marginLeft: PX(24), marginRight: PX(24) }}>
                            <InputSea value={user_info.email} iconName={'mail'} label={'邮箱'} />
                            <InputSea value={user_info.nickname} iconName={'people1'} label={'昵称'} />
                            <InputSea value={user_info.simple_message} iconName={'task'} label={'简介'} />
                            <InputSea value={user_info.job} iconName={'mine'} label={'职位'} />
                            <InputSea value={user_info.personal_web} iconName={'discover'} label={'个人网站'} />
                            <InputSea value={user_info.github} iconName={'github'} label={'github'} />
                        </View>
                    </View>
                </ScrollView>
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
    avatar: { width: PX(130), height: PX(130), borderRadius: PX(65) },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PX(25),
    },
});
export default MyInfoActivity;
