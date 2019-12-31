import React from 'react';
import { Text, View } from 'react-native';
import Icon from '../utils/iconFont';
import ButtonContainer from './Touch';
const defaultProps = {
    iconName: '', // 图标名
    iconColor: '#000', // 图标颜色
    text: '', // 简介
    noBorder: false, // 无底部边框
    num: -1, // 数量 -1代表没有
    other: '', // 附加提示
    unit: '', // 单位
};
const ListIconItem = (props = defaultProps) => {
    let border = props.noBorder ? {} : { borderBottomWidth: PX(1), borderColor: '#f0f0f0' };
    return (
        <ButtonContainer {...props}>
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', height: PX(70), justifyContent: 'space-between', alignItems: 'center', ...border }}>
                <View style={{ marginLeft: PX(26), flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={props.iconName} size={PX(40)} color={props.iconColor} />
                    <Text style={{ marginLeft: PX(15), fontSize: TEXT(24) }}>{props.text}</Text>
                </View>
                <View style={{ fontSize: TEXT(18), color: '#9199a1', flexDirection: 'row', marginRight: PX(24) }}>
                    <Text>{props.other}</Text>
                    {props.num > -1 && <Text>{props.num}</Text>}
                    <Text>{props.unit}</Text>
                </View>
            </View>
        </ButtonContainer>
    );
};
export default ListIconItem;
