import React from 'react';
import { Platform, Image, View, Text, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../utils/iconFont';
import ButtonContainer from './Touch';
// 显示用户信息列表
class ListUserItem extends React.Component {
    static defaultProps = {
        item: {
            author: { nickname: '作者' },
            author_id: '',
            collect_count: 0,
            create_at: '',
            good: false,
            id: '',
            last_reply: '',
            last_reply_at: '',
            reply_count: 1,
            tab: [],
            title: '文章标题',
            top: false,
            update_at: '',
            ups: [],
            visit_count: 0,
        },
    };
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired, // 对应item
        index: PropTypes.number.isRequired, // 对应索引
    };
    goDetail = (user, e) => {
        const { navigation } = this.props;
        // navigation.navigate('TopicDetailActivity', { topic_id: topic._id });
    };
    render() {
        const { item: user } = this.props;
        console.log('this.props', this.props);
        return (
            <ButtonContainer onPress={this.goDetail.bind(this, user)}>
                <View style={styles.list}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={{ color: '#2e2e2e' }}>{`${user.nickname}`}</Text>
                        <Text style={{ fontSize: TEXT(20) }}>{`${user.simple_message}`}</Text>
                        <Text style={{ fontSize: TEXT(20) }}>{`${user.score}积分`}</Text>
                    </View>
                </View>
            </ButtonContainer>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        paddingTop: PX(20),
        paddingRight: PX(30),
        paddingBottom: PX(10),
        backgroundColor: '#ffffff',
        borderBottomWidth: PX(1),
        borderColor: '#f0f0f0',
        flexDirection: 'row',
    },
    avatar: {
        width: PX(80),
        height: PX(80),
        overflow: 'hidden',
        borderRadius: PX(40),
        borderRadius: PX(14),
        marginRight: PX(25),
    },
});
export default ListUserItem;
