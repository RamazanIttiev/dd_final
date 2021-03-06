import React from 'react';
import './AddTask.scss';
import * as Yup from 'yup';
import cn from 'classnames';
import store from '../../state';
import { v4 as uuidv4 } from 'uuid';
import { Button, makeStyles } from '@material-ui/core';
import { Field, FieldArray, Form, Formik } from 'formik';

const useStyles = makeStyles(() => ({
  Modal: {
    background: '#fff',
    width: '500px',
    minHeight: '500px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    border: 'none',
  },

  ModalBtn: {
    width: '100%',
    margin: '0 auto',
    background: 'linear-gradient(90deg, rgba(136, 76, 178, 1) 0%, rgba(235, 87, 87, 1) 100%)',
    color: '#fff',
  },
}));

const AddTask = ({ closeModal }) => {
  const classes = useStyles();
  const [btnValue, setBtnValue] = React.useState('');
  const users = store.users.users;

  let usersName = '';
  let usersAvatar = '';
  let usersId = '';

  users.map(({ avatar, id, name }) => {
    usersName = name;
    usersAvatar = avatar;
    usersId = id;
    return usersName, usersAvatar, usersId;
  });

  const id = uuidv4();
  let date = new Date();

  let commentTime = date.toLocaleTimeString();

  const initialValues = {
    task: {
      id: id,
      usersId: usersId,
      usersAvatar: usersAvatar,
      title: '',
      completed: false,
      status: 'Pending',
      importance: 'Minor',
    },

    comments: [
      {
        usersName: usersName,
        usersAvatar: usersAvatar,
        taskId: id,
        created_at: commentTime,
        id: uuidv4(),
      },
    ],

    messages: [
      {
        taskId: id,
        text: '',
        id: uuidv4(),
      },
    ],
  };

  // Не получилось реализовать повторное добавление комментария при отправки из созданного таска,
  // поэтому оставил так, что можно добавить пустой комментарий
  // пробовал метод filter в компоненте AddComment, но не вышло

  const addNewTask = values => {
    store.tasks.addTask(values.task);

    values.messages.map(message => {
      // if (message.text !== '') {
      values.comments.map(commetBlock => {
        commetBlock.taskTitle = values.task.title;
        store.comments.addComment(commetBlock);

        store.comments.addMessage(message);
      });
      // }
    });
    closeModal();
  };

  return (
    <div className={cn(classes.Modal, 'AddTask')}>
      <h1 className="AddTask__title">Add your new task</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={addNewTask}
        validationSchema={Yup.object().shape({
          task: Yup.object().shape({
            title: Yup.string()
              .required('You forgot to write your task')
              .min(6, 'That is it? Write at least 1 word)'),
          }),
        })}
      >
        {({ errors, touched, isValidating }) => (
          <Form className="AddTask__form">
            <Field
              className={cn('AddTask__textarea', touched.task && errors.task && 'input__error')}
              as="textarea"
              id="Task"
              name="task.title"
              placeholder="Write your task"
            />
            {errors.task && touched.task && <div className="validation">{errors.task.title}</div>}

            <div className="AddTask__radioGroup">
              <label
                className={cn(
                  'AddTask__radioLabel',
                  btnValue === 'Major' ? 'AddTask__radio_active' : '',
                )}
              >
                <Field
                  type="radio"
                  name="task.importance"
                  value="Major"
                  className="AddTask__radio"
                  onClick={e => setBtnValue(e.target.value)}
                />
                Major
              </label>
              <label
                className={cn(
                  'AddTask__radioLabel',
                  btnValue === 'Minor' ? 'AddTask__radio_active' : '',
                )}
              >
                <Field
                  type="radio"
                  name="task.importance"
                  value="Minor"
                  className="AddTask__radio"
                  onClick={e => setBtnValue(e.target.value)}
                />
                Minor
              </label>
            </div>
            <FieldArray
              render={() =>
                initialValues.messages.map((message, index) => (
                  <Field
                    className="AddTask__textarea AddTask__comment"
                    as="textarea"
                    key={index}
                    placeholder="Comment it, if you wish"
                    name={`messages[${index}].text`}
                  />
                ))
              }
            />

            <Button className={classes.ModalBtn} type="submit">
              Add
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTask;
