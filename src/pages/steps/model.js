import Taro from "@tarojs/taro";
import Step from "@/utils/steps/step";
import StepQueue from "@/utils/steps/stepsQueue";
import * as stepApi from "./service";
import moment from "moment";
import { DEFAULT_TIME_FORMAT } from "@/constants";

let s = new StepQueue();
s.add(
  new Step({
    navigationTitle: "实验流程图",
    buttonTitle: "下一步",
    pagePath: "/pages/steps/workflow/index"
  })
);

export default {
  namespace: "step",
  state: {
    steps: {
      block: null,
      numStages: null,
      patchSize: null,
      histBlockSize: null
    },
    progressPercent: 0,
    stepQueue: s,
    hasBuiltStepQueue: false,
    userExperiment: {
      log: null,
      experimentId: 1,
      finishedAt: null,
      isFinished: false,
      userId: null
    }
  },

  effects: {
    *getExperimentResult({ }, { call, select }) {
      try {
        const steps = yield select(state => state.step.steps)
        const res = yield call(
          stepApi.getExperimentResult,
          steps
        );
        return res;
      } catch (error) {
        Taro.showToast({
          icon: 'none',
          title: '暂无符合条件结果'
        })
        return false
      }
    },

    *saveExperimentLog({ payload }, { call }) {
      yield call(stepApi.createUsersExperiments, payload.params)
    },

    *endExperiment({ }, { put, select }) {
      const user = yield select(state => state.user)
      const stepQueue = yield select(state => state.step.stepQueue)
      const ue = yield select(state => state.step.userExperiment)
      console.log(user, stepQueue, ue)
      yield put({
        type: 'save',
        payload: {
          userExperiment: Object.assign({ log: stepQueue.exportAll(), finishedAt: moment().format(DEFAULT_TIME_FORMAT), isFinished: true, userId: user.ID }, ue)
        }
      })
    },

    *startExperiment({ }, { put, select }) {
      const ue = yield select(state => state.step.userExperiment)
      yield put({
        type: 'save',
        payload: {
          userExperiment: Object.assign({
            createdAt: moment().format(DEFAULT_TIME_FORMAT)
          }, ue)
        }
      })
    },

    *resetStepProgressCount({ }, { put }) {
      yield put({
        type: 'save',
        payload: {
          progressPercent: 0
        }
      })
      return true
    },


    *resetStep({ }, { put }) {
      yield put({
        type: 'save',
        payload: {
          progressPercent: 0,
          stepQueue: s.clearAll(),
          hasBuiltStepQueue: false
        }
      })
    },

    *setStepQueueToRebuild({ }, { put }) {
      yield put({
        type: 'save',
        payload: {
          hasBuiltStepQueue: false
        }
      })
      return true
    },

    *saveStep({ payload }, { put, select }) {
      const orig = yield select(state => state.step.steps)
      yield put({
        type: 'save',
        payload: {
          steps: Object.assign(orig, { ...payload.data })
        }
      })
      return orig
    },

    *addProgressPercent({ payload }, { select, put }) {
      const orig = yield select(state => state.step.progressPercent)
      yield put({
        type: 'save',
        payload: {
          progressPercent: orig + payload.progressPercent
        }
      })
      return true
    },

    *minusProgressPercent({ payload }, { select, put }) {
      const orig = yield select(state => state.step.progressPercent)
      yield put({
        type: 'save',
        payload: {
          progressPercent: orig - payload.progressPercent
        }
      })
      return true
    },

    *buildStepQueue({ }, { put }) {
      let sQueue = new StepQueue();
      sQueue.add(
        new Step({
          navigationTitle: "实验流程图",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/workflow/index"
        })
      );
      sQueue.add(
        new Step({
          navigationTitle: "选择人脸图像",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/face/index"
        })
      );
      sQueue.add(
        new Step({
          navigationTitle: "选择 Patch",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/patch/index"
        })
      );
      sQueue.add(
        new Step({
          navigationTitle: "Patch 可视化",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/patch_visual/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "特征向量和特征值",
          buttonTitle: "提交解答",
          pagePath: "/pages/steps/characteristic/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "特征值可视化",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/characteristic_visual/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "选择 filter",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/filter/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "选择卷积层数",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/convolution/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "卷积结果可视化",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/convolution_visual/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "二值化",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/binarization/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "二值化可视化",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/binarization_visual/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "选择 Block 大小",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/block/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "Block可视化",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/block_visual/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "直方图",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/histogram/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "测试结果",
          buttonTitle: "下一步",
          pagePath: "/pages/steps/result/index"
        })
      );

      sQueue.add(
        new Step({
          navigationTitle: "致谢",
          buttonTitle: "返回首页",
          pagePath: "/pages/thanks/index"
        })
      );

      yield put({
        type: 'save',
        payload: {
          stepQueue: sQueue,
          hasBuiltStepQueue: true
        }
      })
      return sQueue
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
