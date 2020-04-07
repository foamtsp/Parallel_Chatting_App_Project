import React, { useState, useEffect } from "react";

import queryString from 'query-string';
import CreateJobModal from "./CreateJobModal";
import './GroupBar.css';
import GroupList from "../GroupList/GroupList";




let socket;

const GroupBar = ({ name }) => {
 
  const onCreateGroup = () => {
    console.log('test');
  }

  

  return (
        <div>
          <h1>Welcome {name}</h1>
          <div className="Row">
            <div className="Cloumn">
                <input placeholder="Find Group"/>
            </div>
            <div className="Column">
                <CreateJobModal className="Column"/>
            </div>
          </div>
          <div className="GroupContainer">
              <GroupList name={name}/>
            </div>
        </div>
          
  );
}

export default GroupBar;
