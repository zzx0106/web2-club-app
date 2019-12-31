import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Sae } from 'react-native-textinput-effects';
import Icon from '../utils/iconFont';
import PropTypes from 'prop-types';

class InputSea extends PureComponent {
    static defaultProps = {
        iconName: '',
        label: '',
        value: '',
        secureTextEntry: false, // 密码
        expandStyle: {},
    };
    static propTypes = {
        iconName: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        expandStyle: PropTypes.object,
    };
    render() {
        return (
            <View style={{ marginBottom: PX(20) }}>
                <Sae
                    style={{ ...styles.seaStyle, ...this.props.expandStyle }}
                    label={this.props.label}
                    value={this.props.value}
                    iconName={this.props.iconName}
                    iconClass={Icon}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    iconColor={THEME.blue}
                    borderHeight={PX(1)}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    labelStyle: { color: THEME.blue, lineHeight: PX(70), fontSize: TEXT(30), fontWeight: '400', height: PX(70) },
    inputStyle: { color: '#2e2e2e', fontSize: TEXT(28), fontWeight: '400' },
});
export default InputSea;
