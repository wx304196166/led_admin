import {
  login,
  getUserInfo
} from '@/api/login';
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth';
import {
  err
} from '@/utils';
const user = {
  state: {
    token: getToken(),
    userInfo: {},
    username: ''
    /* avatar: '',
    roles: [] */
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERNAME: (state, username) => {
      state.username = username;
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info;
    }
    /* SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    } */
    /* SET_ROLES: (state, roles) => {
      state.roles = roles
    } */
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {

          if (response.code === 0) {
            const data = response.data;
            setToken(data.token);
            commit('SET_TOKEN', data.token);
            commit('SET_USER_INFO', data.info);
            commit('SET_USERNAME', data.info.username);

            resolve();
          } else {
            err(response.message);
            reject();
          }

        }).catch(error => {
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (response.code === 0) {
            const data = response.data;
            commit('SET_TOKEN', data.token);
            commit('SET_USER_INFO', data);
            commit('SET_USERNAME', data.info.username);
            resolve(response);
          } else {
            err(response.message);
            reject();
          }
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    /* LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER_INFO', {})
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }, */

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', {})
        removeToken()
        resolve()
      });
    }
  }
}

export default user
