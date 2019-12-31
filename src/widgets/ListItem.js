import React from 'react';
import { Platform, Image, View, Text, StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../utils/iconFont';
import ButtonContainer from './Touch';

class ListItem extends React.Component {
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
    goDetail = (topic, e) => {
        const { navigation } = this.props;
        navigation.navigate('TopicDetailActivity', { topic_id: topic._id });
    };
    render() {
        const { item: topic } = this.props;
        console.log('this.props', this.props);
        return (
            <ButtonContainer onPress={this.goDetail.bind(this, topic)}>
                <View style={styles.list}>
                    <View style={styles.headerStyle}>
                        <View styles={styles.listLeft}>
                            <Text style={styles.headerTitle}>{topic.title}</Text>

                            <View style={styles.tagList}>
                                {topic.tab.map((tab, idx) => (
                                    <Text style={styles.tag} key={tab.name}>
                                        {tab.name}
                                    </Text>
                                ))}
                            </View>
                            <View style={styles.createBox}>
                                <Icon name="people" size={styles.iconStyle.fontSize} color={styles.iconStyle.color} />
                                <Text style={styles.bottomText}>{topic.author.nickname}</Text>
                                <Text style={styles.createAt}>发表于：{Format.dateFormat(topic.create_at, 'yyyy/MM/dd')}</Text>
                            </View>
                        </View>
                        <View styles={styles.listRight}>
                            <Image source={{ uri: topic.author.avatar }} style={styles.avatar} resizeMode="contain" />
                        </View>
                    </View>

                    <View style={styles.bottomStyle}>
                        <View style={styles.bottomLeft}>
                            <Icon name="browse" size={styles.iconStyle.fontSize} color={styles.iconStyle.color} />
                            <Text style={styles.bottomText}>{topic.visit_count}</Text>
                            <Icon name="message_fill" size={styles.iconStyle.fontSize} color={styles.iconStyle.color} />
                            <Text style={styles.bottomText}>{topic.reply_count}</Text>
                            <Icon name="praise" size={styles.iconStyle.fontSize} color={styles.iconStyle.color} />
                            <Text style={styles.bottomText}>{topic.ups.length}</Text>
                            <Icon name="like" size={styles.iconStyle.fontSize} color={styles.iconStyle.color} />
                            <Text style={styles.bottomText}>{topic.collect_count}</Text>
                        </View>
                        <View style={styles.bottomRight}>
                            <Text style={styles.bottomText}>最后回复</Text>
                            <Text style={{ ...styles.bottomText, ...styles.bottomTextL10 }}>{Format.dateBefor(topic.last_reply_at)}</Text>
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
        justifyContent: 'space-between',
    },
    headerTitle: {
        flex: 1,
        overflow: 'hidden',
        marginTop: PX(-6),
        fontSize: TEXT(32),
        color: '#2e2e2e',
        alignItems: 'flex-start',
    },
    createBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    createAt: {
        fontSize: TEXT(20),
        color: '#9199a1',
    },
    listLeft: {
        flex: 1,
    },
    listRight: {
        width: PX(80),
        height: PX(80),
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: PX(80),
        height: PX(80),
        marginRight: PX(20),
        borderRadius: PX(14),
    },
    bottomStyle: {
        paddingTop: PX(10),
        paddingLeft: PX(-8),
        flexDirection: 'row',
        alignItems: 'center',
        color: '#666',
    },
    bottomLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    bottomRight: {
        flexDirection: 'row',
        fontSize: TEXT(20),
        justifyContent: 'flex-end',
    },
    bottomText: {
        fontSize: TEXT(20),
        color: '#9199a1',
        marginRight: PX(10),
        marginLeft: PX(5),
    },
    bottomTextL10: {
        marginRight: PX(0),
    },
    iconStyle: {
        color: '#9199a1',
        fontSize: TEXT(20),
    },
    tagList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PX(10),
        marginBottom: PX(10),
    },
    tag: {
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: PX(25),
        height: PX(25),
        fontSize: TEXT(18),
        backgroundColor: '#cee0ed',
        color: '#33658a',
        marginRight: PX(10),
        borderRadius: PX(5),
        paddingRight: PX(5),
        paddingLeft: PX(5),
    },
});
export default ListItem;
