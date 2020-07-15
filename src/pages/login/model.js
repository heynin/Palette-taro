/*
 * @Author: 陈鹏宇
 * @Date: 2020-07-11 19:15:18
 * @LastEditTime: 2020-07-15 15:26:58
 * @Description: 用户登录
 * @FilePath: \Palette-taro\src\pages\login\model.js
 */ 
import Taro from "@tarojs/taro";
import * as userApi from "./service";

export default {
  namespace: "user",
  state: {
    token: null,
    refresh: null,
    isLogin: false,
  },

  effects: {
    /**
     * 登录
     * @param {*} param0
     * @param {*} param1
     */
    *login({ payload }, { call, put }) {
      const res = yield call(userApi.login, payload.data);
      console.log(res)
      return res
        // yield put({
        //   type: "save",
        //   payload: {
        //     token: res.data.access,
        //     refresh: res.data.refresh,
        //     isLogin: true
        //   }
        // });
    },
    
    *getCaptcha({_}, {call,put}){
      const res = yield call(userApi.getCaptcha)
      return res
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
