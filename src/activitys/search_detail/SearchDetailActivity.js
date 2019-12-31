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

class SearchDetailActivity extends BaseActivity {
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
        const history = await getStorage('history');
        console.log('history', history);
        this.setState({
            historyList: history || [],
        });
    }
    onChangeText = (text) => {
        this.setState({
            text,
        });
    };
    onSubmitEditing = async (e) => {
        try {
            console.log('e', e.nativeEvent, this.state.search_type);
            let { text } = e.nativeEvent;
            let { search_type = 'topic', historyList = [] } = this.state;
            if (text) {
                historyList.unshift({
                    text,
                    search_type,
                });
                console.log({
                    text,
                    search_type,
                });
                const search = await api_search({
                    search_type,
                    keyword: text,
                });
                console.log('search ', search);
                if (search_type === 'topic') {
                    this.setState({
                        historyList: [...historyList],
                        topicList: search.data.data || [],
                        userList: [],
                    });
                } else if (search_type === 'user') {
                    this.setState({
                        historyList: [...historyList],
                        topicList: [],
                        userList: search.data.data || [],
                    });
                }
                setStorage('history', historyList);
            } else {
                this.setState({
                    historyList: [...historyList],
                    topicList: [],
                });
            }
        } catch (error) {
            console.log('onSubmitEditing error -------->', error);
        }
    };
    deleteHistory = (index) => {
        let historyList = this.state.historyList;
        historyList = historyList.filter((history, _index) => _index !== index);
        this.setState({
            historyList,
        });
        setStorage('history', historyList);
    };
    clearAllHistory = () => {
        this.setState({
            historyList: [],
        });
        removeStorage('history');
    };
    render() {
        const { historyList, topicList, userList } = this.state;
        let showHistory = historyList.length > 0 && topicList.length === 0 && userList.length === 0;
        return (
            <View style={{ flex: 1, paddingLeft: PX(24), paddingRight: PX(24) }}>
                <StatusBar backgroundColor={THEME.blue} animated={true} hidden={false} showHideTransition="fade" networkActivityIndicatorVisible={false} translucent={false} barStyle="dark-content" />
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={this.state.text}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitEditing}
                        maxLength={20}
                        placeholder="搜索"
                        returnKeyType="search" // 键盘的确定按钮时搜索
                        underlineColorAndroid="transparent" // 去除android输入内容的下划线
                    />
                    <Picker
                        mode="dropdown" // 向下拉的模式
                        selectedValue={this.state.search_type}
                        style={{ height: PX(60), width: PX(170) }}
                        onValueChange={(itemValue, itemIndex) => this.setState({ search_type: itemValue })}
                    >
                        <Picker.Item label="找文章" value="topic" />
                        <Picker.Item label="找人" value="user" />
                    </Picker>
                </View>
                {showHistory && (
                    <View>
                        <Text style={{ fontWeight: '500', marginBottom: PX(20), marginTop: PX(20) }}>搜索历史</Text>
                        <FlatList
                            data={historyList}
                            initialNumToRender={10}
                            extraData={this.state}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <ButtonContainer onPress={() => console.log('name', item.text, item.search_type)}>
                                        <View style={styles.historyList}>
                                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                <Icon name={'time'} color="#333333" size={PX(30)} />
                                                <Text style={{ marginLeft: PX(12) }}>{item.text}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.deleteHistory(index)} style={{ width: PX(60), alignItems: 'center' }}>
                                                <Icon name={'close'} color="#333333" size={PX(30)} />
                                            </TouchableOpacity>
                                        </View>
                                    </ButtonContainer>
                                );
                            }}
                        />
                        <ButtonContainer onPress={this.clearAllHistory}>
                            <View style={{ width: WIDTH, alignItems: 'center', height: PX(80), justifyContent: 'center' }}>
                                <Text>清除搜素记录</Text>
                            </View>
                        </ButtonContainer>
                    </View>
                )}

                {topicList.length > 0 && (
                    <FlatList
                        data={topicList}
                        initialNumToRender={10}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(props) => {
                            return <ListItem {...props} {...this.props} />;
                        }}
                    />
                )}
                {userList.length > 0 && (
                    <FlatList
                        data={userList}
                        initialNumToRender={10}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(props) => {
                            return <ListUserItem {...props} {...this.props} />;
                        }}
                    />
                )}
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
export default SearchDetailActivity;
