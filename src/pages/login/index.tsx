import { Button, Form, Input, message } from 'antd'
import clsx from 'clsx'
import { connect, Helmet } from 'umi'

import { Icon } from '@/components'
import bg_login from '@/images/bg_login.svg'

import styles from './index.less'

import type { ConnectRC, Loading, Dispatch, IModelApp, IModelLogin } from 'umi'

const { Item, useForm } = Form

interface IProps {
	loading: boolean
	app_data: IModelApp
	page_data: IModelLogin
	dispatch: Dispatch
}

const Index: ConnectRC<IProps> = (props) => {
	const { loading, app_data, page_data, dispatch } = props
	const { app_info } = app_data
	const { captcha } = page_data
	const [form] = useForm()
	const { getFieldValue } = form

	const onFinish = (v: any) => {
		const is_email = v.mobile.indexOf('@') !== -1

		if (is_email) {
			if (
				!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
					v.mobile
				)
			) {
				return message.warning('邮箱格式错误')
			}
		} else {
			if (!/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(v.mobile)) {
				return message.warning('手机号格式错误')
			}
		}

		dispatch({
			type: 'login/login',
			payload: {
				[is_email ? 'email' : 'mobile']: v.mobile,
				password: v.password,
				captcha: {
					id: captcha.id,
					code: v.captcha_code
				}
			}
		})
	}

	return (
		<div className={styles._local}>
			<Helmet>
				<title>{app_info.name || ''}</title>
				<link
					rel='shortcut icon'
					type='image/x-icon'
					href={app_info.icons?.favicon}
				/>
			</Helmet>
			<div className='bg_wrap flex justify_center align_center'>
				<img className='bg' src={bg_login} alt='bg_login' />
			</div>
			<div className='login_wrap relative'>
				<div className='login h_100 flex flex_column justify_center'>
					<div className='logo_wrap w_100 flex justify_center'>
						<span
							className='logo'
							style={{
								backgroundImage: `url(data:image/png;base64,${app_info.icons?.png})`
							}}
						/>
					</div>
					<div className='title_wrap w_100 border_box flex flex_column'>
						<span className='title'>登录系统</span>
						<span className='desc'>
							请使用管理员手机号和登录密码登录系统
						</span>
					</div>
					<Form
						className='form_wrap flex flex_column'
						name='form_login'
						form={form}
						onFinish={onFinish}
					>
						<div className='input_wrap'>
							<Item noStyle shouldUpdate>
								{() => (
									<Item noStyle name='mobile'>
										<Input
											className={clsx([
												'input input_mobile',
												getFieldValue('mobile')
													? 'has_value'
													: ''
											])}
											type='text'
											maxLength={30}
											prefix={
												<Icon
													name='person_outline-outline'
													size={21}
												></Icon>
											}
										></Input>
									</Item>
								)}
							</Item>
						</div>
						<div className='input_wrap'>
							<Item noStyle shouldUpdate>
								{() => (
									<Item noStyle name='password'>
										<Input
											className={clsx([
												'input input_password',
												getFieldValue('password')
													? 'has_value'
													: ''
											])}
											type='password'
											maxLength={23}
											prefix={
												<Icon
													name='lock-outline'
													size={21}
												></Icon>
											}
										></Input>
									</Item>
								)}
							</Item>
						</div>
						<div className='input_wrap relative'>
							<Item noStyle shouldUpdate>
								{() => (
									<Item noStyle name='captcha_code'>
										<Input
											className={clsx([
												'input input_captcha_code',
												getFieldValue(
													'captcha_code'
												)
													? 'has_value'
													: ''
											])}
											autoComplete='off'
											type='text'
											maxLength={6}
											prefix={
												<Icon
													name='security-outline'
													size={20}
												></Icon>
											}
										></Input>
									</Item>
								)}
							</Item>
							<span
								className='img_captcha_code absolute cursor_point'
								style={{
									backgroundImage: `url(${captcha.content})`
								}}
								onClick={() =>
									dispatch({ type: 'login/getCaptcha' })
								}
							/>
						</div>
						<Item noStyle shouldUpdate>
							{() => (
								<Button
									className='btn_login'
									type='primary'
									htmlType='submit'
									shape='round'
									disabled={
										!(
											getFieldValue('mobile') &&
											getFieldValue('password') &&
											getFieldValue('captcha_code')
										)
									}
									loading={loading}
								>
									立即登录
								</Button>
							)}
						</Item>
					</Form>
					<div className='copyright w_100 absolute flex justify_center'>
						<span>由</span>
						<a href='https://www.iqka.com/' target='_blank'>
							象传智慧
						</a>
						<span>提供技术支持</span>
					</div>
				</div>
			</div>
		</div>
	)
}

const getInitialProps = ({
	loading,
	app,
	login
}: {
	loading: Loading
	app: IModelApp
	login: IModelLogin
}) => ({
	loading: !!loading.effects[`login/login`],
	app_data: app,
	page_data: login
})

export default window.$app.memo(connect(getInitialProps)(Index))
