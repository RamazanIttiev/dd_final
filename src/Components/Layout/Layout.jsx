import React from 'react';
import AllComments from '../AllComments/AllComments';
import AllTasks from '../AllTasks/AllTasks';
import './Layout.scss';

const Layout = () => {
  return (
    <div className="Layout">
      <div className="Layout__wrapper">
        <div className="Layout__heading">
          <h1>
            You’ve got <span>7 task </span>today
          </h1>
          <button>Add new</button>
        </div>
        <AllTasks />
      </div>
      <AllComments />
    </div>
  );
};

export default Layout;
