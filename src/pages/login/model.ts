import modelExtend from 'dva-model-extend'
import store from 'store'
import { history } from 'umi'

import pageModel from '@/utils/model'

import { getCaptcha, login } from './service'

import type { IModelApp } from 'umi'

export interface IModelLogin {
	captcha: {
		id: string
		content: string
	}
}

export default modelExtend(pageModel, {
	namespace: 'login',

	state: {
		captcha: {}
	},

	subscriptions: {
		setup({ history, dispatch }) {
			dispatch({ type: 'inspect' })

			history.listen((location) => {
				if (location.pathname !== '/login') return

				// dispatch({ type: 'getCaptcha' })
			})
		}
	},

	effects: {
		*getCaptcha({}, { call, put }) {
			const captcha = yield call(getCaptcha)

			yield put({
				type: 'updateState',
				payload: { captcha }
			})
		},
		*login({ payload }, { call, put }) {
			const res = yield call(login, payload)

			if (!res.token) return

			yield put({
				type: 'app/updateState',
				payload: { user: res.user, menu: res.menus } as IModelApp
			})

			sessionStorage.setItem('token', res.token)
			store.set('user', res.user)
			store.set('menu', res.menus)

			history.push('/kanban')
		}
	}
})
