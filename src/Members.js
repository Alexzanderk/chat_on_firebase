import React, { useEffect } from 'react';
import { useCollection } from './hooks/useCollection';

function Members({ channelId }) {
  const members = useCollection('users', 'displayName', [
    `channels.${channelId}`,
    '==',
    true
  ]);

  return (
    <div className="Members">
      <div>
        {members.sort(sortByName).map(member => console.log({member}) || (
          
          <div key={member.id} className="Member">
            <div className={`MemberStatus ${member.status && member.status.state}`} />
            {member.displayName}
          </div>
        ))}
      </div>
    </div>
  );
}

function sortByName(a, b) {
  return a.displayName > b.displayName
    ? 1
    : a.displayName < b.displayName
    ? -1
    : 0;
}

export default Members;
