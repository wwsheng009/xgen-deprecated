import { message, Modal } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { request } from 'umi'

import Form from '@/cloud/components/form/Form'
import { Icon } from '@/components'
import { getDeepValueByText } from '@/utils/helpers/filters'

import { bindDataItem } from '../../form/Table/utils'
import styles from './index.less'

import type { ModalProps } from 'antd'

interface IProps {
	title: string
	table: string
	id: string
	data: {
		max: number
		ok?: number
		value: number
		desc: Array<string>
		table_name: string
	}
	queryDataSource: any
	hideHistory?: boolean
	height?: number
}

const Index = (props: IProps) => {
	const { title, table, id, data, queryDataSource, hideHistory } = props
	const [form_setting, setFormSetting] = useState({})
	const [form_data, setFormData] = useState({})
	const [visible_form, setVisibleForm] = useState(false)
	// const form_id = getDeepValueByText(id, queryDataSource)
	const form_id = bindDataItem(id, queryDataSource)

	const getFormSetting = async () => {
		const setting = await request(`/api/xiang/table/${table}/setting`)

		setFormSetting(setting)
	}

	const getFormData = async () => {
		const data = await request(`/api/xiang/table/${table}/find/${form_id}`)

		setFormData(data)
	}

	const showForm = async () => {
		const close = message.loading('loading', 0)

		await getFormSetting()
		await getFormData()

		close()

		setVisibleForm(true)
	}

	const props_modal: ModalProps = {
		visible: visible_form,
		width: 900,
		footer: false,
		closable: false,
		zIndex: 1000,
		bodyStyle: { padding: 0 }
	}

	const props_form = {
		setting: form_setting,
		data: form_data,
		params: { id: form_id, name: table, type: 'view' },
		onCancel: () => setVisibleForm(false)
	}

	if (!data?.desc) return null

	return (
		<div
			className={clsx([styles._local, 'w_100 border_box flex flex_column'])}
			style={{ height: props?.height ?? 'auto' }}
		>
			<div className='title_wrap flex justify_between align_center'>
				<span className='title'>{title}</span>
				{!hideHistory && (
					<Icon
						className='icon_history cursor_point'
						name='icon-clock'
						size={18}
						onClick={() => showForm()}
					></Icon>
				)}
			</div>
			<div
				className='indicator_wrap w_100 border_box flex flex_column justify_center'
				style={{
					height: props?.height
						? `calc(${props.height}px - 48px - 33px + 24px)`
						: 'auto'
				}}
			>
				<div className='desc_items w_100 border_box flex justify_between'>
					{data.desc.map((item, index) => (
						<span className='desc_item' key={index}>
							{item}
						</span>
					))}
				</div>
				<div className='line_wrap w_100 border_box'>
					<div className='line w_100 relative'>
						<div
							className='value_item value flex flex_column align_center absolute'
							style={{ left: `${(data.value * 100) / data.max}%` }}
						>
							<span className='scale'></span>
							<span className='number'>{data.value}</span>
						</div>
						{data?.ok && (
							<div
								className='value_item ok flex flex_column align_center absolute'
								style={{ left: `${(data.ok * 100) / data.max}%` }}
							>
								<span className='scale'></span>
								<span className='number'>{data.ok}</span>
							</div>
						)}
					</div>
				</div>
			</div>
			<Modal {...props_modal}>
				<Form {...props_form}></Form>
			</Modal>
		</div>
	)
}

export default window.$app.memo(Index)
