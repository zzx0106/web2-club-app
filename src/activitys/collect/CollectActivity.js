import React from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import { api_getKey, api_login, api_getTopic } from '../../api/api';
class CollectActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '收藏',
    });
    state = {};

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} />
                <Text>收藏</Text>
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
export default CollectActivity;
