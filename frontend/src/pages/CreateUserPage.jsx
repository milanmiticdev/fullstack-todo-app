// React
import { useReducer, useContext } from 'react';

// Contenxt
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { useNavigate } from 'react-router-dom';

// Components
import Form from './../components/Form.jsx';
import FormField from './../components/FormField.jsx';
import FormBtn from './../components/FormBtn.jsx';
import Modal from './../components/Modal.jsx';
import Spinner from './../components/Spinner.jsx';

// Controllers
import userController from './../controllers/user.controller.js';

// Utils
import validators from './../utils/validators.js';

// Styles
import styles from './CreateUserPage.module.css';

// Initial reducer state
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
	roleField: {
		value: '',
		error: false,
		message: '',
	},
	loading: false,
	error: false,
	spinner: '',
	modal: {
		open: false,
		error: false,
		message: '',
	},
};

// Reducr function
const reducer = (state, action) => {
	switch (action.type) {
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'email-field-change':
			return { ...state, emailField: action.payload };
		case 'password-field-change':
			return { ...state, passwordField: action.payload };
		case 'role-field-change':
			return { ...state, roleField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'error-change':
			return { ...state, error: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const CreateUserPage = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { createUser } = userController;
	const { validateName, validateEmail, validatePassword, validateRole } = validators;

	const handleCreateUser = async e => await createUser(token, state, dispatch, navigate, e);

	return (
		<main className={state.loading ? `${styles.loading}` : `${styles.createUserPage}`}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && (
				<Form onSubmit={handleCreateUser} heading="CREATE USER">
					<FormField
						name="name"
						type="text"
						fieldChange="name-field-change"
						onDispatch={dispatch}
						onValidate={validateName}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="email"
						type="text"
						fieldChange="email-field-change"
						onDispatch={dispatch}
						onValidate={validateEmail}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="password"
						type="password"
						fieldChange="password-field-change"
						onDispatch={dispatch}
						onValidate={validatePassword}
						readOnly={false}
						autoFocus={false}
					/>
					<FormField
						name="role"
						type="text"
						fieldChange="role-field-change"
						onDispatch={dispatch}
						onValidate={validateRole}
						readOnly={false}
						autoFocus={false}
					/>
					<FormBtn text="CREATE" type="submit" color="blue" />
				</Form>
			)}
		</main>
	);
};

export default CreateUserPage;
