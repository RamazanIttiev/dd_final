import React from 'react';
import './App.scss';
import store from '../state';
import Header from '../сomponents/Header/Header.jsx';
import Layout from '../сomponents/Layout/Layout.jsx';
import { observer } from 'mobx-react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const App = observer(() => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    store.tasks.getTasks();
    store.comments.getMessages();
    store.comments.getComments();
    store.users.getUsers();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <Header />
      <Layout />
      {store.preloader.preloader && (
        <Backdrop
          className={classes.backdrop}
          open={store.preloader.preloader}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
});

export default App;
