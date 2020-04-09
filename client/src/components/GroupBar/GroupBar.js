import React, { useState, useEffect } from "react";

import queryString from 'query-string';
import CreateJobModal from "./CreateJobModal";
import './GroupBar.css';
import GroupList from "../GroupList/GroupList";



const GroupBar = ({ name }) => {
  

  return (
        <div>
          <h1 className = "welcome">Welcome {name}</h1>
          <div className="Row">
            <div className="Column">
                <input placeholder="Find Group"/>
            </div>
            <div className="Column">
                <CreateJobModal className="Column" name={name}/>
            </div>
          </div>
          <div className="GroupContainer">
              <GroupList name={name}/>
          </div>
        </div>
          
  );
}

export default GroupBar;
