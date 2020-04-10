import React from 'react';

import './Input.css';


// const onSendMessage = (name,text,groupname) =>{
 
//       let timer = null;

//       var sending_data = {
//         name:name,
//         messages:text
//       }

//       fetch("http://localhost:4000/api/groups/"+groupname+"/message" , {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(sending_data)
//       })
//       .then(function (response) {
//           if (response.status >= 400) {
//             throw new Error("Bad response from server");
//           }
//           return response.json();
//         })
//       .then(timer = setTimeout(() => window.location.reload(false), 500));
// }
//   //onSendMessage(name,message,groupname)



const Input = ({ setMessage, sendMessage, message, name, groupname }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
  </form>
)

export default Input;