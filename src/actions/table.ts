import { message } from 'antd'
import modelExtend from 'dva-model-extend'
import qs from 'query-string'
import { history } from 'umi'

import { batchDel, batchUpdate, getSetting, save, search } from '@/services/app'
import pageModel from '@/utils/model'

import type { IModelTable } from 'umi'

export default modelExtend(pageModel, {
	state: {
		setting: {},
		table: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
			showSizeChanger: true
		}
	} as IModelTable,

	effects: {
		*getSetting({ payload = {} }, { call, put }) {
			const setting = yield call(getSetting, payload)

			yield put({
				type: 'updateState',
				payload: { setting } as IModelTable
			})
		},
		*search({ payload: { name, query } }, { call, put }) {
			const data = yield call(search, { name, query: qs.stringify(query) })

			yield put({
				type: 'updateState',
				payload: {
					table: data.data,
					pagination: {
						current: Number(data.page) || 1,
						pageSize: Number(data.pagesize) || 10,
						total: data.total,
						showSizeChanger: true
					}
				}
			})
		},
		*save({ payload: { name, data } }, { call, put }) {
			const res = yield call(save, { name, data })

			if (res === false) return

			message.success('操作成功')

			yield put({
				type: 'search',
				payload: { name, query: history.location.query }
			})
		},
		*batchDel({ payload: { name, ids } }, { call, put }) {
			const res = yield call(batchDel, { name, ids })

			if (res === false) return

			message.success('操作成功')

			yield put({
				type: 'search',
				payload: { name, query: history.location.query }
			})
		},
		*batchUpdate({ payload: { name, ids, data } }, { call, put }) {
			const res = yield call(batchUpdate, { name, ids, data })

			if (res === false) return

			message.success('操作成功')

			yield put({
				type: 'search',
				payload: { name, query: history.location.query }
			})
		}
	}
})
