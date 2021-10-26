import { Button, Col, Form, Row, Tooltip } from 'antd'
import clsx from 'clsx'
import { useEffect } from 'react'
import { getDvaApp, history, useParams } from 'umi'

import Dynamic from '@/cloud/core'
import { Icon } from '@/components'
import { PlusOutlined } from '@ant-design/icons'

import { useCalcLayout, useFilters, useVisibleMore } from './hooks'
import styles from './index.less'

const { useForm } = Form

const Index = ({ setting }: any) => {
	const params = useParams<{ name: string }>()
	const [form] = useForm()
	const { getFieldsValue, setFieldsValue, resetFields } = form
	const { display_more, opacity_more, visible_more, setVisibleMore } = useVisibleMore()
	const filters = useFilters(setting)
	const query = history.location.query

	const { base, more, visible_btn_more } = useCalcLayout(filters, setting)

	useEffect(() => {
		if (!Object.keys(query as any).length) return resetFields()

		setFieldsValue(query)
	}, [query])

	const onFinish = (v: any) => {
		history.push({
			pathname: history.location.pathname,
			query: {
				...query,
				...v
			}
		})
	}

	const onReset = () => {
		resetFields()
		onFinish(getFieldsValue())
	}

	const add = () => {
		getDvaApp()._store.dispatch({
			type: 'app/updateState',
			payload: { visible_menu: false }
		})

		history.push({
			pathname: `/form/${params.name}/0`
		})
	}

	return (
		<Form
			className={styles._local}
			form={form}
			name={`form_filter_${history.location.pathname}`}
			onFinish={onFinish}
			onReset={onReset}
		>
			<Row gutter={16} justify='space-between' style={{ marginBottom: 20 }}>
				{base.map((item: any, index: number) => (
					<Col span={item.span} key={index}>
						<Dynamic
							type='form'
							name={item.input.type}
							props={{
								...item.input.props,
								name: item.bind,
								label: item.label,
								string: '1'
							}}
						></Dynamic>
					</Col>
				))}
				<Col span={2}>
					<Button
						className='w_100 flex justify_center align_center'
						type='primary'
						htmlType='submit'
					>
						搜索
					</Button>
				</Col>
				<Col span={2}>
					<Button
						className='w_100 flex justify_center align_center'
						htmlType='reset'
					>
						重置
					</Button>
				</Col>
				<Col flex='auto'>
					<div className='flex justify_end'>
						{visible_btn_more && (
							<Tooltip title='更多筛选项'>
								<Button
									className='btn_more no_text w_100 flex justify_center align_center mr_16'
									icon={
										<Icon
											name='icon-filter'
											size={15}
										></Icon>
									}
									onClick={() => setVisibleMore(true)}
								></Button>
							</Tooltip>
						)}
						<Button
							className='btn_add flex justify_center align_center'
							type='primary'
							onClick={add}
							icon={<PlusOutlined></PlusOutlined>}
						>
							{setting.list.actions.create.props.label}
						</Button>
					</div>
				</Col>
			</Row>
			{visible_more && (
				<div
					className={clsx([
						'more_wrap w_100 border_box flex_column transition_normal relative',
						opacity_more ? 'opacity' : '',
						display_more ? 'display' : ''
					])}
				>
					<a
						className='icon_wrap flex justify_center align_center transition_normal cursor_point clickable absolute'
						onClick={() => setVisibleMore(false)}
					>
						<Icon className='icon' name='icon-x' size={16}></Icon>
					</a>
					<Row gutter={16} style={{ marginBottom: 16 }}>
						{more.map((item: any, index: number) => (
							<Col span={item.span} key={index}>
								<Dynamic
									type='form'
									name={item.input.type}
									props={{
										...item.input.props,
										name: item.bind,
										label: item.label,
										string: '1'
									}}
								></Dynamic>
							</Col>
						))}
					</Row>
				</div>
			)}
		</Form>
	)
}

export default window.$app.memo(Index)
