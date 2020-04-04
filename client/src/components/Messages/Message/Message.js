import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;
  let isSentBySystem = false;

  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  if(user.toLowerCase() === 'admin'){
    isSentBySystem = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="mb-10">
          <p className="messageContainer justifyEnd mb-0">{trimmedName}</p>
          <div className="messageContainer justifyEnd">
            <p className="sentText pr-10 mb-0">5:18 pm.</p>
            <div className="messageBox backgroundBlue">
              <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
            </div>
          </div>
        </div>
        )
        : isSentBySystem
        ? (
            <div className="messageContainer justifyCenter">
              <div className="messageBox backgroundLight">
                <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
              </div>
            </div>
          )
        :(
          <div className="mb-10">
            <p className="messageContainer justifyStart mb-0">{user}</p>
            <div className="messageContainer justifyStart">
              <div className="messageBox backgroundLight">
                <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
              </div>
              <p className="sentText pl-10 ">5:18 pm.</p>
            </div>
          </div>
        )
  );
}

export default Message;