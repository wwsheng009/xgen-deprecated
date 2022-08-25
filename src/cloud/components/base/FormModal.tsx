interface IProps {
	type?: 'view'
	value: string
	formId: string
	formName: string
	settingApi?: string
	edit: (id: string, name: string, type?: string, settingApi?: string) => Promise<void>
}

const Index = (props: IProps) => {
	return (
		<span
			className='edit_text line_clamp_2'
			onClick={() =>
				props.edit(props.formId, props.formName, props?.type, props?.settingApi)
			}
		>
			{props.value}
		</span>
	)
}

export default window.$app.memo(Index)
