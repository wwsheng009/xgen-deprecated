import store from 'store'

import { inspect } from '@/services/app'

import type { Model } from '@/typings/dva'
import type { IMenu } from '@/typings/menu'

export interface IModelApp {
	app_info: {
		name: string
		short: string
		version: string
            description: string
            favicon:string
		icons: {
			icns: string
			ico: string
			png: string
		}
	}
	user: any
	menu: Array<IMenu>
	current_nav: number
	current_menu: number
	visible_menu: boolean
}

export default {
	namespace: 'app',

	state: {
		app_info: store.get('app_info') || {},
		user: store.get('user') || [],
		menu: store.get('menu') || [],
		current_nav: store.get('current_nav') || 0,
		current_menu: store.get('current_menu') || 0,
		visible_menu: true
	} as IModelApp,

	subscriptions: {
		setup({ dispatch }) {
			dispatch({ type: 'inspect' })
		}
	},

	effects: {
		*inspect({}, { call, put }) {
			const app_info = yield call(inspect)

			yield put({
				type: 'updateState',
				payload: { app_info } as IModelApp
			})

			store.set('app_info', app_info)
		}
	},

	reducers: {
		updateState(state, { payload }: any) {
			return {
				...state,
				...payload
			}
		}
	}
} as Model

export interface IModelTable {
	setting: any
	table: Array<any>
	pagination: {
		current: number
		pageSize: number
		total: number
		showSizeChanger: boolean
	}
}

export interface IModelForm {
	setting: any
	data: any
}
