/**
 * Created by wuyunqiang on 2018/1/12.
 */
import React, { Component, PureComponent } from 'react';
import ButtonContainer from './Touch';
import { AppRegistry, LayoutAnimation, UIManager, TouchableNativeFeedback, TouchableWithoutFeedback, Dimensions, PixelRatio, Platform, StyleSheet, Text, View, NativeModules, ImageBackground, DeviceEventEmitter } from 'react-native';
export default class TabBar extends PureComponent {
    static defaultProps = {};
    constructor(props) {
        super(props);
    }
    componentDidMount() {}
    renderItem = (route, index, count) => {
        const { navigation, jumpTo } = this.props;
        const focused = index === navigation.state.index;
        const color = focused ? this.props.activeTintColor : this.props.inactiveTintColor;
        let TabScene = {
            focused: focused,
            route: route,
            tintColor: color,
        };
        if (index == Math.floor(count / 2)) {
            return <View key={'' + index} style={{ width: WIDTH / count }} />; //占位使用
        }
        console.log('styles.tabItem', styles.tabItem);
        return (
            <ButtonContainer onPress={this.navigationTo.bind(this, route.key)} key={route.key} style={{ width: WIDTH / count, flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ width: WIDTH / count, ...styles.tabItem }}>
                    <View style={{ flex: 1 }} />
                    {this.props.renderIcon(TabScene)}
                    <View style={{ flex: 1 }} />
                    <Text style={{ ...styles.tabText, color: color }}>{this.props.getLabelText(TabScene)}</Text>
                    <View style={{ flex: 1 }} />
                </View>
            </ButtonContainer>
        );
    };
    navigationTo = (key) => {
        const { jumpTo, navigation } = this.props;
        // LayoutAnimation.configureNext({
        //     duration: 300,
        //     create: {
        //         type: LayoutAnimation.Types.linear,
        //         property: LayoutAnimation.Properties.scaleXY,
        //     },
        //     update: {
        //         type: LayoutAnimation.Types.linear,
        //         springDamping: 0.4,
        //     },
        // });
        console.log('jumpTo', this.props, jumpTo, key);
        if (key === 'Add') {
            navigation.navigate('TopicCreateActivity');
            return;
        }
        jumpTo(key);
        this.target = !this.target;
        // this.setState({ anim_size: anim_size + (this.target ? PX(10) : -PX(10)) });
    };
    renderCenter = (route, index, count) => {
        const { navigation, jumpTo } = this.props;
        const focused = index === navigation.state.index;
        const color = focused ? this.props.activeTintColor : this.props.inactiveTintColor;
        let TabScene = {
            focused: focused,
            route: route,
            tintColor: color,
        };
        return (
            <View style={{ position: 'absolute', left: (WIDTH - PX(80)) / 2, right: WIDTH - PX(80), backgroundColor: 'transparent', width: PX(80), height: PX(80), bottom: PX(8), alignItems: 'center', justifyContent: 'center' }}>
                <TouchableWithoutFeedback key={'centerView'} onPress={this.navigationTo.bind(this, route.key)}>
                    <View
                        style={{
                            width: PX(80),
                            height: PX(80),
                            borderRadius: PX(40),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#649EFB',
                        }}
                    >
                        {this.props.renderIcon(TabScene)}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
    render() {
        const { navigation } = this.props;
        const { routes } = navigation.state;
        console.log('routes', routes);
        let arr = [];
        let center;
        for (let i = 0; i < routes.length; i++) {
            arr.push(this.renderItem(routes[i], i, routes.length)); //其他正常item
            if (i == Math.floor(routes.length / 2)) {
                //中间凸起的item
                center = this.renderCenter(routes[i], i, routes.length);
            }
        }

        return (
            <View
                pointerEvents={'box-none'} //此组件不接收点击事件 子组件可以点击
            >
                {/**其他正常View**/}
                <View style={{ width: WIDTH, backgroundColor: 'white', position: 'absolute', bottom: 0, flexDirection: 'row', borderTopWidth: 1 / PixelRatio.get(), borderColor: 'rgba(0,0,0,0.1)' }}>{arr}</View>
                {/**中间凸起的view**/}
                {center}
            </View>
        );
    }
}
// {/*{routes && routes.map((route,index) => this.renderItem(route, index,routes.length))}*/}
const styles = {
    tabItem: {
        height: PX(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: TEXT(16),
        marginTop: PX(-10),
    },
};
