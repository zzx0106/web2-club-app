import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Kohana } from 'react-native-textinput-effects';
import Icon from '../utils/iconFont';
import PropTypes from 'prop-types';

class InputKohana extends PureComponent {
    static defaultProps = {
        iconName: '',
        label: '',
        secureTextEntry: false, // 密码
        expandStyle: {},
    };
    static propTypes = {
        iconName: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        expandStyle: PropTypes.object,
    };
    render() {
        return (
            <Kohana
                style={{ ...styles.kohanaStyle, ...this.props.expandStyle }}
                label={this.props.label}
                iconClass={Icon}
                blurOnSubmit //提交时失去焦点
                iconSize={PX(30)}
                iconColor={'#666666'}
                inputPadding={PX(0)}
                labelStyle={styles.labelStyle}
                inputStyle={styles.inputStyle}
                labelContainerStyle={styles.container}
                iconContainerStyle={styles.container}
                useNativeDriver
                {...this.props}
            />
        );
    }
}
const styles = StyleSheet.create({
    kohanaStyle: { backgroundColor: '#ECEFF0', alignItems: 'center', fontWeight: '500', borderRadius: PX(3), width: WIDTH - PX(40), height: PX(70) },
    labelStyle: { color: '#b1babf', lineHeight: PX(70), fontSize: TEXT(24), fontWeight: '400', height: PX(70) },
    inputStyle: { color: '#666666', fontSize: TEXT(24), height: PX(70), marginLeft: PX(15), fontWeight: '400' },
    container: { paddingLeft: PX(15), height: PX(70) },
});
export default InputKohana;
