/**
 * 优化原始Component
 */
import React from 'react';
import { is } from 'immutable';
import { InteractionManager } from 'react-native';

class BaseActivity extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {};
        const thisState = this.state || {};
        nextState = nextState || {};
        nextProps = nextProps || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length || Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }

        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                return true;
            }
        }

        for (const key in nextState) {
            if (!is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    asyncMethod(todo) {
        InteractionManager.runAfterInteractions(() => {
            if (typeof todo == 'function') {
                todo && todo();
            }
        });
    }
}

export default BaseActivity;
