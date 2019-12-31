import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import ButtonContainer from '../widgets/Touch';

class FloatBtn extends React.Component {
    openMenu = () => {
        Toast('open');
        console.log(this.props);
    };
    componentDidMount() {}
    render() {
        return (
            <View style={styles.floatBtnBox}>
                <BoxShadow
                    setting={{
                        width: PX(80),
                        height: PX(80),
                        color: '#000000',
                        border: PX(10),
                        radius: PX(38),
                        style: { justifyContent: 'center', alignItems: 'center', marginVertical: 30, marginHorizontal: 40 },
                        opacity: 0.4,
                        x: 1,
                        y: PX(7),
                    }}
                >
                    <ButtonContainer {...this.props} style={styles.btn}>
                        <View style={styles.floatBtn}>{this.props.children}</View>
                    </ButtonContainer>
                </BoxShadow>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    floatBtnBox: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        width: PX(100),
        height: PX(100),
        bottom: PX(164),
        right: PX(30),
    },
    btn: {
        width: PX(100),
        height: PX(100),
        borderRadius: PX(100),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    floatBtn: {
        justifyContent: 'center',
        width: PX(100),
        height: PX(100),
        backgroundColor: '#3F51B5',
        alignItems: 'center',
        borderRadius: PX(100),
    },
});
export default FloatBtn;
