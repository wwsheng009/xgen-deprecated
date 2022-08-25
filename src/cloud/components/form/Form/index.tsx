import { Button, Form, message, Modal } from 'antd'
import qs from 'query-string'
import { useEffect, useMemo, useState } from 'react'
import { history, request, useIntl } from 'umi'

import { getGroupValue } from '@/utils/helpers/filters'

import FormItems from './components/FormItems'
import Options from './components/Options'
import { useFieldset } from './hooks'
import styles from './index.less'

import type { Dispatch } from 'umi'
import type { IProps as IPropsFormItems } from './components/FormItems'

const { useForm } = Form
const { confirm } = Modal

interface IProps {
	setting: any
	data?: any
	params: {
		id: string
		name: string
		type?: string
	}
	pathname?: string
	defaultValues?: any
	dispatch?: Dispatch
	onCancel?: () => void
	search?: () => void
	getData?: () => Promise<void>
}

const Index = (props: IProps) => {
	const {
		setting,
		data,
		params,
		pathname,
		defaultValues,
		dispatch,
		onCancel,
		getData,
		search
	} = props
	const [type, setType] = useState('')
	const [form] = useForm()
	const fieldset = useFieldset(setting)
	const { setFieldsValue, resetFields } = form
	const { query } = history.location
	const { messages } = useIntl()

	useEffect(() => {
		if (params.id === '0' || !Object.keys(data).length) {
			return resetFields()
		}

		setFieldsValue(data)
	}, [params, data])

	useEffect(() => {
		if (!defaultValues) return
		if (!Object.keys(defaultValues).length) return

		setFieldsValue(defaultValues)
	}, [defaultValues])

	useEffect(() => {
		if (pathname && dispatch) {
			// 针对 Form 页面
			setType((query?.type as string) || '')
		} else {
			// 针对 Table 中的 Form
			setType(params.type || '')
		}
	}, [params, query])

	const { onFinish, onDel } = useMemo(() => {
		if (pathname && dispatch) {
			// 针对 Form 页面
			const onFinish = (v: any) => {
				const data = params.id === '0' ? v : { ...v, id: params.id }

				dispatch({
					type: `${pathname}/save`,
					payload: { name: params.name, data, dev: setting?.edit?.option?.dev }
				})
			}

			const onDel = () => {
				dispatch({
					type: `${pathname}/del`,
					payload: { name: params.name, id: params.id }
				})
			}

			return { onFinish, onDel }
		} else {
			// 针对 Table 中的 Form
			const onFinish = async (v: any) => {
				const data = params.id === '0' ? v : { ...v, id: params.id }

				const close = message.loading('loading', 0)

				await request(`/api/xiang/table/${params.name}/save`, {
					method: 'POST',
					data
				})

				// 针对在 Form 页面中使用的 Table 上的 Form
				await getData?.()

				// 针对在 Table 页面中使用的 Table 上的 Form
				search?.()

				close()
				onCancel?.()
			}

			const onDel = async () => {
				const close = message.loading('loading', 0)

				const res = await request(
					`/api/xiang/table/${params.name}/delete/${params.id}`,
					{
						method: 'POST'
					}
				)

				if (res === false) return

				message.success('删除成功')

				// 针对在 Form 页面中使用的 Table 上的 Form
				await getData?.()

				// 针对在 Table 页面中使用的 Table 上的 Form
				search?.()

				close()
				onCancel?.()
			}

			return { onFinish, onDel }
		}
	}, [params, data])

	const onItem = (it: any) => {
		const post_data = getGroupValue(it?.data, data)

		if (it?.link) {
			window.open(`${it.link}?${qs.stringify(post_data)}`)

			return
		}

		const postAction = async () => {
			const res = await request(it.api, {
				method: 'POST',
				data: post_data
			})

			if (!res) return

			if (pathname && dispatch) {
				if (!setting?.edit?.option?.dev) {
					history.goBack()
				}
			} else {
				onCancel?.()
			}

			message.success('操作成功！')
		}

		if (it?.confirm) {
			confirm({
				title: '操作提示',
				content: `确认${it.title}？`,
				onOk() {
					postAction()
				}
			})
		} else {
			postAction()
		}
	}

	const searchFormData = () => {
		if (pathname && dispatch) {
			dispatch({
				type: `${pathname}/find`,
				payload: {
					name: params.name,
					id: params.id
				}
			})
		} else {
			return getData
		}
	}

	const props_options = {
		setting,
		type,
		data,
		pathname,
		onItem,
		onCancel
	}

	const props_form_items: IPropsFormItems = {
		fieldset,
		params,
		type,
		data,
		searchFormData
	}

	return (
		<Form
			className={styles._local}
			form={form}
			name={`form_filter_${pathname}`}
			onFinish={onFinish}
		>
			<div className='form_title_wrap w_100 border_box flex justify_between align_center'>
				<span className='title'>
					{params.id === '0'
						? (messages as any).form.title.add
						: type === 'view'
						? (messages as any).form.title.view
						: (messages as any).form.title.edit}
				</span>
				<Options {...props_options}></Options>
			</div>
			<div className='form_wrap w_100 border_box flex flex_column'>
				<FormItems {...props_form_items}></FormItems>
				{params.id !== '0' && type !== 'view' && setting.edit.actions.delete.type && (
					<div className='actions_wrap danger w_100 border_box flex flex_column'>
						<div className='form_item_title_wrap flex flex_column'>
							<span className='section_title'>
								{
									(messages as any).form.more_actions.delete
										.action_title
								}
							</span>
							<span className='desc'>
								{(messages as any).form.more_actions.delete.tip}
							</span>
						</div>
						<div className='action_items flex flex_column'>
							<div className='action_item w_100 border_box flex justify_between'>
								<div className='left_wrap flex flex_column'>
									<span className='title'>
										{
											(messages as any).form
												.more_actions.delete.title
										}
									</span>
									<span className='desc'>
										{
											(messages as any).form
												.more_actions.delete.desc
										}
									</span>
								</div>
								<Button
									className='btn_normal'
									onClick={() =>
										confirm({
											title: (messages as any).form
												.more_actions.delete.confirm
												.title,
											content: (messages as any).form
												.more_actions.delete.confirm
												.content,
											centered: true,
											onOk() {
												onDel()
											}
										})
									}
								>
									{
										(messages as any).form.more_actions
											.delete.btn_text
									}
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</Form>
	)
}

export default window.$app.memo(Index)
