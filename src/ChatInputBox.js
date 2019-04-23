import React, { useState } from 'react';
import { db } from './firebase';


function ChatInputBox({ user, channelId }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    db.collection('channels')
      .doc(channelId)
      .collection('messages')
      .add({
        user: db.collection('users').doc(user.uid),
        text: value,
        createdAt: new Date()
      });
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="ChatInputBox">
      <input
        onChange={({ target }) => {
          setValue(target.value);
        }}
        value={value}
        className="ChatInput"
        placeholder="Message #general"
      />
    </form>
  );
}

export default ChatInputBox;
