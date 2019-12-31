import React, { PureComponent } from 'react';
import { Linking, ScrollView, Dimensions } from 'react-native';
import HTML from 'react-native-render-html';

export default class HtmlView extends PureComponent {
    _handleLinkPress(url) {
        Linking.canOpenURL(url)
            .then((support) => {
                if (support) {
                    Linking.openURL(url);
                }
            })
            .catch((err) => console.log(err));
    }
    render() {
        const { html, styles } = this.props;
        return (
            <ScrollView style={{ flex: 1 }}>
                <HTML html={html} containerStyle={styles} onLinkPress={this._handleLinkPress} imagesMaxWidth={Dimensions.get('window').width} />
            </ScrollView>
        );
    }
}
