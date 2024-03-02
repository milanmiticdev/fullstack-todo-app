// React
import { useReducer, useEffect, useContext } from 'react';

// React Router
import { useParams, useNavigate } from 'react-router-dom';

// Context
import AuthContext from '../../contexts/AuthContext.js';

// Components
import Form from './../../components/shared/Form.jsx';
import FormBtn from './../../components/shared/FormBtn.jsx';
import FormBtns from './../../components/shared/FormBtns.jsx';
import FormField from './../../components/shared/FormField.jsx';
import Modal from './../../components/shared/Modal.jsx';
import Page from './../../components/shared/Page.jsx';
import Section from './../../components/shared/Section.jsx';
import Spinner from './../../components/shared/Spinner.jsx';

// Controllers
import taskController from './../../controllers/task.controller.js';

// Utils
import validators from './../../utils/validators.js';
import UTCtoLocal from './../../utils/UTCtoLocal.js';

// Initial reducer state
const initialState = {
	result: {},
	nameField: {
		value: '',
		error: false,
		message: '',
	},
	loading: false,
	error: false,
	editing: false,
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
		case 'result-change':
			return { ...state, result: action.payload };
		case 'name-field-change':
			return { ...state, nameField: action.payload };
		case 'loading-change':
			return { ...state, loading: action.payload };
		case 'error-change':
			return { ...state, error: action.payload };
		case 'editing-change':
			return { ...state, editing: action.payload };
		case 'spinner-change':
			return { ...state, spinner: action.payload };
		case 'modal-change':
			return { ...state, modal: action.payload };
	}
};

const ViewTask = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { userRole, token } = useContext(AuthContext);
	const { taskId } = useParams();
	const navigate = useNavigate();

	const { getTaskById, updateTaskById, deleteTaskById } = taskController;
	const { validateName } = validators;

	const handleEditBtn = e => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: true });
	};
	const handleCancelBtn = e => {
		e.preventDefault();
		dispatch({ type: 'editing-change', payload: false });
	};

	const handleUpdateTaskById = async e => await updateTaskById(taskId, userRole, token, state, dispatch, navigate, e);
	const handleDeleteTaskById = async e => await deleteTaskById(taskId, userRole, token, dispatch, navigate, e);

	useEffect(() => {
		const handleGetTaskById = async () => await getTaskById(taskId, token, dispatch);
		handleGetTaskById();
	}, [taskId, token, dispatch, getTaskById]);

	return (
		<Page loading={state.loading}>
			{state.loading && <Spinner text={state.spinner} />}
			{!state.loading && state.modal.open && <Modal modal={state.modal} onDispatch={dispatch} />}
			{!state.loading && !state.error && state.result && (
				<>
					<Section>
						<Form onSubmit={handleUpdateTaskById} heading="TASK INFO">
							<FormField
								name="name"
								type="text"
								initial={state.result.name}
								fieldChange="name-field-change"
								onDispatch={dispatch}
								onValidate={validateName}
								readOnly={state.editing ? false : true}
								autoFocus={false}
							/>
							<FormField name="creator" type="text" initial={state.result.userEmail} readOnly={true} autoFocus={false} />
							<FormField
								name="created"
								type="text"
								initial={`${UTCtoLocal(state.result.createdAt).date} ${UTCtoLocal(state.result.createdAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							<FormField
								name="updated"
								type="text"
								initial={`${UTCtoLocal(state.result.updatedAt).date} ${UTCtoLocal(state.result.updatedAt).time}`}
								readOnly={true}
								autoFocus={false}
							/>
							{state.editing ? (
								<FormBtns>
									<FormBtn text="SAVE" type="submit" color="blue" />
									<FormBtn text="X" type="button" color="red" onClick={handleCancelBtn} />
								</FormBtns>
							) : (
								<FormBtn text="EDIT" type="button" color="gray" onClick={handleEditBtn} />
							)}
						</Form>
					</Section>
					<Section>
						<Form onSubmit={handleDeleteTaskById} heading="DELETE TASK">
							<FormBtn text="DELETE" type="submit" color="red" />
						</Form>
					</Section>
				</>
			)}
		</Page>
	);
};

export default ViewTask;