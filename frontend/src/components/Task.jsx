// React
import { useContext } from 'react';

// Context
import AuthContext from './../contexts/AuthContext.js';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// Utils
import taskController from './../controllers/task.controller.js';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from './Task.module.css';

// PropTypes
import PropTypes from 'prop-types';

const Task = ({ task, onDispatch }) => {
	const { userRole, token } = useContext(AuthContext);
	const navigate = useNavigate();

	const { deleteTaskById } = taskController;

	const handleDeleteTaskById = async () => await deleteTaskById(task.id, userRole, token, onDispatch, navigate);

	return (
		<article className={styles.task}>
			<p className={styles.taskText}>{task.name}</p>
			<div className={styles.taskButtons}>
				<Link to={`/update-task/${task.id}`}>
					<button className={`${styles.taskActionBtn} ${styles.editBtn}`}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				</Link>
				<button className={`${styles.taskActionBtn} ${styles.deleteBtn}`}>
					<FontAwesomeIcon icon={faTrash} onClick={handleDeleteTaskById} />
				</button>
			</div>
		</article>
	);
};

export default Task;

Task.propTypes = {
	task: PropTypes.object,
	onDispatch: PropTypes.func,
};
