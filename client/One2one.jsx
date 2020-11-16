import React from 'react';

import ChatroomPreview from './One2OneList'
import DivideTitle from './DivideTitle';

export default ({
  chatrooms,
  onEnterChatroom
}) => (
  <div>
    <DivideTitle name="一对一模式" />
    {
      chatrooms.map(chatroom => (
        <ChatroomPreview
          key={chatroom.name}
          chatroom={chatroom}
          onEnter={() => onEnterChatroom(chatroom.name)}
        />
      ))
    }
  </div>
)
