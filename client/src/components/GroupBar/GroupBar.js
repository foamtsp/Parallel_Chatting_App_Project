import React from "react";

import CreateJobModal from "./CreateJobModal";
import './GroupBar.css';
import GroupList from "../GroupList/GroupList";

//onSendLeaveMessage

const GroupBar = ({ name,onSendLeaveMessage }) => {
  

  return (
        <div>
          <div className="Row">
            <h2 className = "welcome">Welcome {name}</h2>
            <button className='logoutBtn'>
            <a className = "logout" href="/">Logout</a>
            </button>
          </div>
          <div className="Row">
            <div className="Column">
                <input className="GroupInput" placeholder="Find Group"/>
            </div>
            <div className="Column NewGroup">
                <CreateJobModal className="Column" name={name}/>
            </div>
          </div>
          <div className="GroupContainer">
              <GroupList name={name} onSendLeaveMessage={onSendLeaveMessage}/>
          </div>
        </div>
          
  );
}

export default GroupBar;
