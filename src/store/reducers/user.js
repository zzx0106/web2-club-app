const INITIAL_STATE = {
    user_info: {
        following: [],
        followers: [],
        collect_topic_count: 0,
        topic_count: 0,
        score: 0,
        github: '',
        simple_message: '',
    },
    islogin: false,
};

export default function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user_info: {
                    // 覆盖不替换
                    ...state.user_info,
                    ...action.payload,
                },
                islogin: true,
            };
        case 'AFTER_LOGOUT':
            return {
                ...state,
                user_info: { following: [], followers: [], collect_topic_count: 0, topic_count: 0, score: 0, github: '', simple_message: '' },
                islogin: false,
            };
    }
    return state;
}
