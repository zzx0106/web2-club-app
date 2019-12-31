export const rx_login = (user_info) => {
    return {
        type: 'LOGIN',
        payload: user_info,
    };
};
/**
 * 获取用户信息
 */
export const rx_user = () => {
    return {
        type: 'USER',
    };
};

/**
 * 获取用户信息
 */
export const rx_logout = () => {
  return {
      type: 'LOGOUT',
  };
};