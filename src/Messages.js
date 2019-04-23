import React, { useState, useEffect, useRef } from 'react';
import { useCollection } from './hooks/useCollection';
import formatDate from 'date-fns/format';
import isSameDay from 'date-fns/is_same_day';
import useDoc from './hooks/useDoc';

function ChatScroller(props) {
  const ref = useRef();
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (shouldScrollRef.current) {
      const node = ref.current;
      node.scrollTop = node.scrollHeight;
    }
  });

  const handleScroll = () => {
    const node = ref.current;
    const { scrollTop, clientHeight, scrollHeight } = node;
    const atBottom = scrollHeight === clientHeight + scrollTop;
    
    shouldScrollRef.current = atBottom;
  };

  return <div {...props} ref={ref} onScroll={handleScroll} />;
}

function Messages({ channelId }) {
  const messages = useCollection(`channels/${channelId}/messages`, 'createdAt');

  return (
    <ChatScroller className="Messages">
      <div className="EndOfMessages">That's every message!</div>
      {messages.map((message, i) => {
        const previous = messages[i - 1];
        const showAvatar = shouldShowAvatar(previous, message);
        const showDay = shouldShowDay(previous, message);

        return showAvatar ? (
          <MessageWithAvatar key={i} message={message} showDay={showDay} />
        ) : (
          <div key={i}>
            <div className="Message no-avatar">
              <div className="MessageContent">{message.text}</div>
            </div>
          </div>
        );
      })}
    </ChatScroller>
  );
}

function MessageWithAvatar({ message, showDay }) {
  const author = useDoc(message.user.path);

  return (
    <div>
      {showDay && (
        <div className="Day">
          <div className="DayLine" />
          <div className="DayText">
            {new Date(message.createdAt.seconds * 1000).toLocaleDateString()}
          </div>
          <div className="DayLine" />
        </div>
      )}
      <div className="Message with-avatar">
        <div
          className="Avatar"
          style={{
            backgroundImage: `url('${author && author.photoURL}')`
          }}
        />
        <div className="Author">
          <div>
            <span className="UserName">{author && author.displayName} </span>{' '}
            <span className="TimeStamp">
              {formatDate(message.createdAt.seconds * 1000, 'hh:mm')}
            </span>
          </div>
          <div className="MessageContent">{message.text}</div>
        </div>
      </div>
    </div>
  );
}

function shouldShowDay(previous, message) {
  const isFirst = !previous;
  if (isFirst) {
    return true;
  }

  const isNewDay = !isSameDay(
    previous.createdAt.seconds * 1000,
    message.createdAt.seconds * 1000
  );
  return isNewDay;
}

function shouldShowAvatar(previous, message) {
  const isFirst = !previous;
  if (isFirst) {
    return true;
  }

  const differentUser = message.user.id !== previous.user.id;
  if (differentUser) {
    return true;
  }

  const hasBeenAWhile =
    message.createdAt.seconds - previous.createdAt.seconds > 60;
  return hasBeenAWhile;
}

export default Messages;
