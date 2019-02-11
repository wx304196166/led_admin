import Cookies from 'js-cookie';
import {
  err
} from '@/utils';
import {
  queryAllByList
} from '@/api/common';
const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    map: {}
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_MAP: (state, map) => {
      state.map = map;
    }
  },
  actions: {
    ToggleSideBar: ({
      commit
    }) => {
      commit('TOGGLE_SIDEBAR');
    },
    CloseSideBar({
      commit
    }, {
      withoutAnimation
    }) {
      commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    ToggleDevice({
      commit
    }, device) {
      commit('TOGGLE_DEVICE', device);
    },
    // 获取映射关系
    SetMap({
      commit
    }) {
      queryAllByList(['brand', 'classification', 'label', 'product', 'customer_user']).then(response => {
        if (response.code === 0) {
          commit('SET_MAP', response.data);
        } else {
          err(response.message);
        }
      })
    }
  }
};

export default app;
