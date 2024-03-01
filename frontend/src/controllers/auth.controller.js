import validators from './../utils/validators.js';
const { validateName, validateEmail, validatePassword } = validators;

const loginUser = async (state, dispatch, login, navigate, e) => {
	if (e) {
		e.preventDefault();
	}

	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);

	if (emailStatus.error || passwordStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		try {
			const user = {
				email: state.emailField.value,
				password: state.passwordField.value,
			};

			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Login' });

			const response = await fetch('http://localhost:5174/api/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			});
			const data = await response.json();

			if (data.status === 200) {
				login(data.user.id, data.user.role, data.token);
				navigate('/');
			} else {
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

const registerUser = async (state, dispatch, login, navigate, e) => {
	if (e) {
		e.preventDefault();
	}

	const nameStatus = validateName(state.nameField.value);
	const emailStatus = validateEmail(state.emailField.value);
	const passwordStatus = validatePassword(state.passwordField.value);

	if (nameStatus.error || emailStatus.error || passwordStatus.error) {
		dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Check your inputs.' } });
	} else {
		try {
			const user = {
				name: state.nameField.value,
				email: state.emailField.value,
				password: state.passwordField.value,
			};

			dispatch({ type: 'loading-change', payload: true });
			dispatch({ type: 'spinner-change', payload: 'Register' });

			const response = await fetch('http://localhost:5174/api/v1/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			});
			const data = await response.json();

			if (data.status === 201) {
				login(data.user.id, data.user.role, data.token);
				navigate('/');
			} else {
				dispatch({ type: 'modal-change', payload: { open: true, error: true, message: data.message } });
			}
		} catch {
			dispatch({ type: 'modal-change', payload: { open: true, error: true, message: 'Something went wrong.' } });
		} finally {
			dispatch({ type: 'loading-change', payload: false });
			dispatch({ type: 'spinner-change', payload: '' });
		}
	}
};

const controller = { loginUser, registerUser };

export default controller;
