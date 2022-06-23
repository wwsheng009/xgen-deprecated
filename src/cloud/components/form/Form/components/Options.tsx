import { Affix, Button } from 'antd'
import clsx from 'clsx'
import { useState } from 'react'
import { history, useIntl } from 'umi'

import { Icon } from '@/components'
import { getDeepValueByText } from '@/utils/helpers/filters'

interface IProps {
	setting: any
	type: string
	data: any
	pathname?: string
	onItem: (it: any) => void
	onCancel?: () => void
}

const Index = (props: IProps) => {
	const { setting, type, data, pathname, onItem, onCancel } = props
	const [stick, setStick] = useState<boolean | undefined>(false)
	const { messages } = useIntl()

	const getDisabled = (
		disabled: { key: string; value: string | number | Array<string | number> },
		item: any
	) => {
		if (!disabled) return false

		const value = getDeepValueByText(disabled.key, item)

		if (Array.isArray(disabled.value)) {
			if (disabled.value.includes(value)) {
				return true
			}
		} else {
			if (disabled.value === value) return true
		}

		return false
	}

	return (
		<Affix offsetTop={11} style={{ zIndex: 101 }} onChange={(v) => setStick(v)}>
			<div
				className={clsx([
					'action_items flex transition_normal',
					stick ? 'stick' : ''
				])}
			>
				{setting.edit?.option?.operation && (
					<div className='operation_wrap flex align_center'>
						{setting.edit?.option?.operation?.map(
							(item: any, index: number) => (
								<Button
									className={clsx([
										'btn_action btn_back btn auto',
										stick ? 'stick' : '',
										item?.type
											? item.type + ' has_type'
											: 'btn_normal',
										getDisabled(item?.disabled, data)
											? 'disabled'
											: ''
									])}
									icon={
										<Icon name={item.icon} size={15}></Icon>
									}
									key={index}
									onClick={() => onItem(item)}
								>
									{item.title}
								</Button>
							)
						)}
					</div>
				)}
				<Button
					className={clsx([
						'btn_action btn_back btn btn_normal',
						stick ? 'stick' : ''
					])}
					icon={<Icon name='icon-arrow-left' size={15}></Icon>}
					onClick={pathname ? () => history.goBack() : onCancel}
				>
					{pathname
						? (messages as any).form.actions.back
						: (messages as any).form.actions.cancel}
				</Button>
				{type !== 'view' && (
					<Button
						className='btn_action btn_confirm'
						type='primary'
						htmlType='submit'
					>
						{(messages as any).form.actions.save}
					</Button>
				)}
			</div>
		</Affix>
	)
}

export default window.$app.memo(Index)
