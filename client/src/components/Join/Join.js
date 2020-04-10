import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Join.css';

export default function SignIn() {
  const [name, setName] = useState('');

  const onLogin= (name) =>{

    
        let timer = null;

        var sending_data = {
          name:name,
        }

        fetch("http://localhost:4000/api/users" , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sending_data)
        })
        .then(function (response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
          })
        .then(timer = setTimeout(() => window.location.reload(false), 500));
    
    
  }

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
       
        <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/chat?name=${name}&room=default`}>
          <button className={'button mt-20'} onClick={()=>onLogin(name)} type="submit">Sign In</button>
        </Link>
      </div>
    </div>
  );
}
