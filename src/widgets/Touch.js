import React from 'react';
import { Platform, View, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
class ButtonContainer extends React.Component {
    render() {
        if (Platform.OS === 'android') {
            return (
                <View {...this.props}>
                    <TouchableNativeFeedback {...this.props}>{this.props.children}</TouchableNativeFeedback>
                </View>
            );
        }
        return (
            <View {...this.props}>
                <TouchableWithoutFeedback {...this.props}>{this.props.children}</TouchableWithoutFeedback>
            </View>
        );
    }
}
export default ButtonContainer;
