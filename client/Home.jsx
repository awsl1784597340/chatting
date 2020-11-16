import React from 'react';

import ChatroomPreview from './ChatroomPreview'
import DivideTitle from './DivideTitle';

export default ({
  chatrooms,
  onEnterChatroom
}) => (
  <div>
    <DivideTitle name="多人聊天模式" />
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
