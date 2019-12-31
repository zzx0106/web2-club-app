import React, { Component } from 'react';
import { AppState, UIManager, LayoutAnimation, Easing, TouchableOpacity, InteractionManager, AccessibilityInfo, Animated, Platform, StyleSheet, BackHandler, SafeAreaView, View, FlatList, Image } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import { Provider, connect } from 'react-redux';
import configStore from './store/store';
import './utils/adapter';
import './utils/storage';
import './utils/tools';
import './utils/formate';
const store = configStore();
import RootTab from './routers/TabNavigation';
import Home from './activitys/home/HomeActivity';
import Fun from './activitys/fun/FunActivity';
import TopicDetailActivity from './activitys/topic_detail/TopicDetailActivity';
import TopicCreateActivity from './activitys/topic_create/TopicCreateActivity';
import UserLoginActivity from './activitys/user_login/UserLoginActivity';
import MySettingActivity from './activitys/my_setting/MySettingActivity';
import ClassifyActivity from './activitys/classify/ClassifyActivity';
import SearchDetailActivity from './activitys/search_detail/SearchDetailActivity';
import MyTopicsActivity from './activitys/my_topics/MyTopicsActivity';
import MyCollectionActivity from './activitys/my_collection/MyCollectionActivity';
import MyFollowersActivity from './activitys/my_followers/MyFollowersActivity';
import MyFollowingActivity from './activitys/my_following/MyFollowingActivity';
import MyInfoActivity from './activitys/my_info/MyInfoActivity';
import ButtonContainer from './widgets/Touch';
import Icon from './utils/iconFont';
const StackOptions = ({ navigation }) => {
    console.log('navigation', navigation);
    const gesturesEnabled = false;
    const header = null;
    return { gesturesEnabled, header };
};
const AppNavigator = createStackNavigator(
    {
        RootTab: {
            screen: RootTab,
            navigationOptions: (navigation) => {
                console.log('++++++++++++', navigation);
                return {
                    header: null,
                };
            },
        },
        HomeActivity: {
            screen: Home,
        },
        FunActivity: {
            screen: Fun,
        },
        TopicDetailActivity: {
            screen: TopicDetailActivity,
        },
        TopicCreateActivity: {
            screen: TopicCreateActivity,
        },
        UserLoginActivity: {
            screen: UserLoginActivity,
        },
        MySettingActivity: {
            screen: MySettingActivity,
        },
        ClassifyActivity: {
            screen: ClassifyActivity,
        },
        SearchDetailActivity: {
            screen: SearchDetailActivity,
        },
        MyTopicsActivity: {
            screen: MyTopicsActivity,
        },
        MyCollectionActivity: {
            screen: MyCollectionActivity,
        },
        MyFollowersActivity: {
            screen: MyFollowersActivity,
        },
        MyFollowingActivity: {
            screen: MyFollowingActivity,
        },
        MyInfoActivity: {
            screen: MyInfoActivity,
        },
    },
    {
        initialRouteName: 'RootTab',
        // 覆盖每个组件的NavigationOptions
        defaultNavigationOptions: ({ navigation }) => ({
            headerLeft: (
                <ButtonContainer style={{ marginLeft: PX(10) }} onPress={() => console.log(navigation.goBack())}>
                    <Icon name="return" size={24} color={'#fff'} />
                </ButtonContainer>
            ),
            headerTitleStyle: {
                color: '#fff',
                marginLeft: PX(0),
            },
            headerStyle: {
                backgroundColor: THEME.blue,
                height: PX(70),
                shadowOpacity: 0,
                elevation: 0,
                color: '#fff',
                borderBottomWidth: 0,
            },
            headerBackTitleStyle: {
                color: '#fff',
            },
        }),

        mode: 'modal',
        // headerMode: 'none',

        transitionConfig: () => ({
            screenInterpolator: StackViewStyleInterpolator.forHorizontal, // 安卓导航进入 左右方式
            transitionSpec: {
                duration: 300,
                easing: Easing.linear(),
                timing: Animated.timing,
            },
        }),
    }
);
const AppContainer = createAppContainer(AppNavigator);
export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}
