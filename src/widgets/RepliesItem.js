import React from 'react';
import { Platform, Image, View, Text, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../utils/iconFont';
import ButtonContainer from './Touch';
import HtmlView from './HtmlView';
import LottieView from 'lottie-react-native';
import { api_upReplies } from '../api/api';

class RepliesItem extends React.Component {
    static defaultProps = {
        item: {
            author: { nickname: '作者', avatar: '', name: '', level: 0 },
            content: '', // 内容
            create_at: '', // 创建时间
            id: '',
            is_uped: false,
            reply_id: '',
            ups: [], // 点赞列表
        },
        onUped() {},
        userId: '',
    };
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired, // 对应item
        index: PropTypes.number.isRequired, // 对应索引
        onUped: PropTypes.func.isRequired, // 对应点击事件
        userId: PropTypes.string, // 当前用户id
    };

    state = {
        isUped: false,
    };
    componentWillMount() {
        const isUpReplies = this.isUpReplies(this.props.item.ups, this.props.userId);
        this.setState({
            isUped: isUpReplies,
        });
    }
    componentDidMount() {}
    upUser = async () => {
        try {
            if (!this.props.userId) {
                Toast('请先登录');
                setTimeout(() => this.navigation.navigate('UserLoginActivity'), 3000);
                return;
            }
            if (this.props.item.reply_id) {
                const result = await api_upReplies(this.props.item.reply_id);
                if (result.msg === 'ok') {
                    console.log('result', result);
                    this.props.onUped(this.props.index);
                    if (result.data.type === 0) {
                        this.ups.play(0, 34);
                    } else if (result.data.type === 1) {
                        this.ups.play(70, 90);
                    } else {
                        Toast(result.data.rspinf);
                    }
                } else {
                    Toast('点赞失败');
                }
            } else {
                Toast('无法回复');
            }
        } catch (error) {
            console.error(error);
        }
    };
    isUpReplies(ups = [], id = '') {
        return ups.indexOf(id) !== -1;
    }
    render() {
        console.log('this.props', this.props);
        const { item: replie, userId } = this.props;
        const { isUped } = this.state;
        const { nickname = '作者', avatar = '', name = '', level = 0, is_uped } = replie.author;
        return (
            <ButtonContainer
                onLongPress={() => {
                    this.setState({ visible: true });
                }}
            >
                <View style={styles.list}>
                    <View style={styles.headerStyle}>
                        <View style={styles.listLeft}>
                            <Image source={{ uri: replie.author.avatar }} style={styles.avatar} resizeMode="contain" />
                        </View>
                        <View style={styles.listRight}>
                            <View style={styles.authorInfo}>
                                <View>
                                    <Text style={styles.nickname}>{nickname}</Text>
                                    <Text style={styles.level}>{level}级大神</Text>
                                </View>
                                <ButtonContainer onPress={this.upUser}>
                                    <View style={styles.ups}>
                                        <LottieView
                                            progress={isUped || is_uped ? 60 : 0}
                                            source={require('../lottie/ups.json')}
                                            loop={false}
                                            ref={(ups) => (this.ups = ups)}
                                            style={{ top: PX(-14), width: PX(100), height: PX(100) }}
                                        />
                                        {/* <Icon name="praise" size={styles.iconStyle.fontSize} color={styles.iconStyle.color} /> */}
                                        <Text style={styles.upsText}>{replie.ups.length}</Text>
                                    </View>
                                </ButtonContainer>
                            </View>
                            <HtmlView html={replie.content} />
                            <Text style={styles.createAt}>{Format.dateBefor(replie.create_at)}</Text>
                        </View>
                    </View>
                </View>
            </ButtonContainer>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        paddingTop: PX(20),
        paddingLeft: PX(30),
        paddingRight: PX(30),
        paddingBottom: PX(10),
        backgroundColor: '#ffffff',
        borderBottomWidth: PX(1),
        borderColor: '#f0f0f0',
    },
    headerStyle: {
        flex: 1,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    authorInfo: {
        flex: 1,
        marginTop: PX(0),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ups: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    upsText: {
        color: '#9199a1',
        marginLeft: PX(10),
    },
    nickname: {
        overflow: 'hidden',
        fontSize: TEXT(24),
        color: '#2e2e2e',
        alignItems: 'flex-start',
    },
    level: {
        overflow: 'hidden',
        fontSize: TEXT(18),
        color: '#9199a1',
        alignItems: 'flex-start',
    },
    createBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    createAt: {
        fontSize: TEXT(18),
        color: '#9199a1',
    },
    listLeft: {
        marginRight: PX(15),
    },
    avatar: {
        width: PX(80),
        height: PX(80),
        overflow: 'hidden',
        borderRadius: PX(40),
        borderRadius: PX(14),
    },
    listRight: {
        flex: 1,
        width: PX(200),
        paddingTop: PX(10),
        justifyContent: 'flex-start',
    },
    iconStyle: {
        color: '#9199a1',
        fontSize: TEXT(25),
    },
});
export default RepliesItem;
