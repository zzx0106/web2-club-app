import React from 'react';
import { Text, TouchableOpacity, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import TabBar from '../widgets/TabBar';
import Icon from '../utils/iconFont';

import BaseActivity from '../base/BaseActivity';

import HomeActivity from '../activitys/home/HomeActivity';
import CollectActivity from '../activitys/collect/CollectActivity';
import SearchActivity from '../activitys/search/SearchActivity';
import MyActivity from '../activitys/my/MyActivity';

class IconWithAnim extends BaseActivity {
    state = {};
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(1);
    }
    componentDidMount() {
        console.log('-----------spring---------');
        // this.spring();
    }
    spring() {
        this.springValue.setValue(0.7);
        Animated.spring(this.springValue, {
            toValue: 1,
            friction: 4, // 弹性
            tension: 50, //动画速度 默认40 和 speed只能存在1个
            // speed: 10, // 动画运动速度 默认12
            useNativeDriver: true, // 原生驱动
        }).start(() => {});
    }
    render() {
        const { focused, name, color, size } = this.props;
        console.log('focused 000', name, focused);

        if (focused) {
            this.spring();
        }
        return (
            <Animated.View
                style={{
                    transform: [{ scale: this.springValue }],
                }}
            >
                <View>
                    <Icon name={name} size={size} color={color} />
                </View>
            </Animated.View>
        );
    }
}
class IconWithBadge extends React.Component {
    componentDidMount() {}
    render() {
        const { name, badgeCount, color, size, focused } = this.props;
        return (
            <View>
                <Icon name={name} size={size} color={color} />
                {/* 小红点 */}
                {/* {badgeCount > 0 && (
                  <View
                      style={{
                          // /If you're using react-native < 0.57 overflow outside of the parent
                          // will not work on Android, see https://git.io/fhLJ8
                          position: 'absolute',
                          right: -PX(4),
                          top: -PX(2),
                          backgroundColor: '#FC7A7D',
                          borderRadius: PX(10),
                          width: PX(60),
                          height: PX(60),
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}
                  />
              )} */}
            </View>
        );
    }
}
const HomeIconWithBadge = (props) => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithBadge {...props} badgeCount={3} />;
};
const HomeIconWithAnim = (props) => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithAnim {...props} badgeCount={3} />;
};
const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = Icon;
    let iconName;
    console.log('getTabBarIcon routeName', routeName);
    if (routeName === 'Home') {
        iconName = `${focused ? 'homepage_fill' : 'homepage'}`;
        // We want to add badges to home tab icon
    } else if (routeName === 'Search') {
        iconName = `${focused ? 'searchfill' : 'search'}`;
    } else if (routeName === 'Add') {
        iconName = `${focused ? 'add1' : 'add1'}`;
        return <IconComponent name={iconName} size={PX(35)} color={'#ffffff'} />;
    } else if (routeName === 'Collect') {
        iconName = `${focused ? 'emoji_fill' : 'emoji'}`;
    } else if (routeName === 'My') {
        iconName = `${focused ? 'people_fill' : 'people'}`;
    }

    IconComponent = HomeIconWithAnim;
    // IconComponent = focused ? HomeIconWithAnim : HomeIconWithBadge;

    // You can return any component that you like here!
    return <IconComponent name={iconName} focused={focused} size={PX(focused ? 45 : 42)} color={tintColor} />;
};
export default createBottomTabNavigator(
    {
        Home: {
            screen: HomeActivity,
        },
        Search: { screen: SearchActivity },
        Add: { screen: HomeActivity },
        Collect: { screen: CollectActivity },
        My: { screen: MyActivity },
    },
    {
        swipeEnabled: false,
        lazy: true,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
        // configureTransition: TransitionConfiguration,
        tabBarComponent: (props) => <TabBar {...props} />,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
        }),
        tabBarOptions: {
            activeTintColor: '#747A8B',
            inactiveTintColor: '#DADADA',
            showIcon: true,
            style: {
                borderTopWidth: PX(10),
                borderTopColor: '#000',
                height: PX(145),
                backgroundColor: '#000',
            },
        },
    }
);
