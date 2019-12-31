import React from 'react';
import { Text, FlatList, StyleSheet, TextInput, Picker, TouchableOpacity, StatusBar, View, Platform, LayoutAnimation, Animated, UIManager } from 'react-native';
import FloatBtn from '../../widgets/FloatBtn';
import Icon from '../../utils/iconFont';
import BaseActivity from '../../base/BaseActivity';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import { api_getKey, api_login, api_getTopic, api_search } from '../../api/api';
import ButtonContainer from '../../widgets/Touch';
import ListItem from '../../widgets/ListItem';
import ListUserItem from '../../widgets/ListUserItem';

class SearchActivity extends BaseActivity {
    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: '搜索',
    });
    state = {};
    async componentWillMount() {}
    navigateTo = (route) => {
        if (route === 'searchDetail') {
            this.props.navigation.navigate('SearchDetailActivity');
        }
    };
    render() {
        return (
            <View style={{ flex: 1, paddingLeft: PX(24), paddingRight: PX(24) }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <ButtonContainer onPress={() => this.navigateTo('searchDetail')}>
                    <View style={styles.inputBox}>
                        <View style={styles.input}>
                            <Text>搜索</Text>
                        </View>
                    </View>
                </ButtonContainer>
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
        backgroundColor: '#EFEFEF',
    },
    input: {
        flex: 1,
        height: PX(68),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: PX(20),
    },
    historyList: {
        height: PX(60),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#efefef',
        borderBottomWidth: PX1, //
    },
});
export default SearchActivity;
