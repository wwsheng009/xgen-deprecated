interface IProps {
	value: string
	formId: string
	formName: string
	edit: (id: string, name: string) => Promise<void>
}

const Index = (props: IProps) => {
	return (
		<span
			className='edit_text line_clamp_2'
			onClick={() => props.edit(props.formId, props.formName)}
		>
			{props.value}
		</span>
	)
}

export default window.$app.memo(Index)
