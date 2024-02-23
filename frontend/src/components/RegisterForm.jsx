// React
import { useState, useReducer, useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import FormField from './FormField.jsx';
import Message from './Message.jsx';

// Utils
import validation from './../utils/validation.js';

// Styles
import styles from './RegisterForm.module.css';

const initialState = {
	name: '',
	nameStatus: {
		error: true,
		message: '',
	},
	email: '',
	emailStatus: {
		error: true,
		message: '',
	},
	password: '',
	passwordStatus: {
		error: true,
		message: '',
	},
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'name-field-change':
			return { ...state, name: action.payload };
		case 'name-status-change':
			return { ...state, nameStatus: action.payload };
		case 'email-field-change':
			return { ...state, email: action.payload };
		case 'email-status-change':
			return { ...state, emailStatus: action.payload };
		case 'password-field-change':
			return { ...state, password: action.payload };
		case 'password-status-change':
			return { ...state, passwordStatus: action.payload };
	}
};

const RegisterForm = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [finalMessage, setFinalMessage] = useState('');

	const { login } = useContext(AuthContext);

	const navigate = useNavigate();
	const { validateName, validateEmail, validatePassword, validateUserInput } = validation;

	const handleRegistration = async e => {
		e.preventDefault();

		const user = validateUserInput(state);

		if (user !== null) {
			try {
				const response = await fetch('http://localhost:5174/api/v1/auth/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(user),
				});
				const data = await response.json();
				console.log(data);

				if (data.status === 201) {
					login(data.user.id, data.user.role, data.token);
					setFinalMessage(data.message);
					navigate('/');
				} else {
					setFinalMessage(data.message);
				}
			} catch {
				setFinalMessage('Something went wrong.');
			}
		}
	};

	return (
		<form onSubmit={handleRegistration} className={styles.form}>
			<FormField
				htmlFor="name"
				type="text"
				id="name"
				name="name"
				fieldChange="name-field-change"
				statusChange="name-status-change"
				onValidate={validateName}
				onDispatch={dispatch}
				message={state.nameStatus.message}
			/>
			<FormField
				htmlFor="email"
				type="text"
				id="email"
				name="email"
				fieldChange="email-field-change"
				statusChange="email-status-change"
				onValidate={validateEmail}
				onDispatch={dispatch}
				message={state.emailStatus.message}
			/>
			<FormField
				htmlFor="password"
				type="password"
				id="password"
				name="password"
				fieldChange="password-field-change"
				statusChange="password-status-change"
				onValidate={validatePassword}
				onDispatch={dispatch}
				message={state.passwordStatus.message}
			/>
			<Message message={finalMessage} />
			<button type="submit" className={styles.formSubmit}>
				REGISTER
			</button>
		</form>
	);
};

export default RegisterForm;