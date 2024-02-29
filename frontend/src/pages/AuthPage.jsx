// React
import { useReducer, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import AuthContext from './../contexts/AuthContext.js';

// Components
import TabsToggle from './../components/TabsToggle.jsx';
import Tab from './../components/Tab.jsx';
import Form from './../components/Form.jsx';
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Spinner from './../components/Spinner.jsx';
import Modal from './../components/Modal.jsx';

// Utils
import authController from './../utils/controllers/auth.controller.js';
import validation from './../utils/validation.js';

// Styles
import styles from './AuthPage.module.css';

const initialState = {
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	emailField: {
		value: '',
		error: false,
		message: '',
	},
	passwordField: {
		value: '',
		error: false,
		message: '',
	},
	section: 'login',
	loading: false,
	spinnerText: '',
	modal: {
		isOpen: false,
		error: false,
		message: '',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'email-field-change':
			return { ...state, emailField: action.payload };
		case 'password-field-change':
			return { ...state, passwordField: action.payload };
		case 'section-change':
			return { ...state, section: action.payload };
		case 'is-loading':
			return { ...state, loading: action.payload };
		case 'spinner-text-change':
			return { ...state, spinnerText: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const AuthPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const { loginUser, registerUser } = authController;
	const { validateName, validateEmail, validatePassword } = validation;

	const handleLoginUser = async e => {
		await loginUser(e, state, dispatch, login, navigate);
	};

	const handleRegisterUser = async e => {
		await registerUser(e, state, dispatch, login, navigate);
	};

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.authPage}`}>
			{state.loading && <Spinner text={state.spinnerText} />}
			{!state.loading && state.modal.isOpen && <Modal modal={state.modal} dispatch={dispatch} />}
			{!state.loading && (
				<TabsToggle>
					<Tab section={state.section} dispatch={dispatch} type="section-change" payload="login" position="left" text="LOGIN" />
					<Tab
						section={state.section}
						dispatch={dispatch}
						type="section-change"
						payload="register"
						position="right"
						text="REGISTER"
					/>
				</TabsToggle>
			)}
			{!state.loading && (
				<Form onSubmit={state.section === 'login' ? handleLoginUser : handleRegisterUser}>
					{state.section === 'register' && (
						<FormField
							field="name"
							type="text"
							fieldChange="name-field-change"
							onValidate={validateName}
							onDispatch={dispatch}
							message={state.nameField.message}
							section={state.section}
						/>
					)}
					<FormField
						field="email"
						type="text"
						fieldChange="email-field-change"
						onValidate={validateEmail}
						onDispatch={dispatch}
						message={state.emailField.message}
						section={state.section}
					/>
					<FormField
						field="password"
						type="password"
						fieldChange="password-field-change"
						onValidate={validatePassword}
						onDispatch={dispatch}
						message={state.passwordField.message}
						section={state.section}
					/>
					<FormBtn text="LOGIN" color="blue" />
				</Form>
			)}
		</main>
	);
};

export default AuthPage;
