import * as React from 'react';
import { debounce, get } from 'lodash';
import { identity } from './common';
import { PusherUser, GiftedMessage, ChatRoomState } from './interfaces';

const { withChatkit } = require('@pusher/chatkit-client-react');

interface MessagePart {
  partType: 'inline' | 'url' | 'attachment',
  payload: any,
}

interface MessageFromPusher {
  id: string,
  parts: MessagePart[],
  sender: PusherUser,
  createdAt: Date,
}

interface Props {
  chatkit: any,
  user: PusherUser,
  children: React.ReactChild,
}

const defaultState: ChatRoomState = {
  loading: false,
  currentRoomId: undefined,
  messages: [],
  participants: [],
  setCurrentRoomId: identity,
  onSend: identity,
  onInputTextChanged: identity,
};

export const ChatRoomContext = React.createContext<ChatRoomState>(defaultState);

const getPayload = (message: MessageFromPusher) => get(
  message,
  'parts[0[.payload.content', 'Cannot render this message'
);

const usersWhoAreTypingBuffer: any = {};
const messageBuffer: GiftedMessage[] = [];

export const ChatRoomProvider = withChatkit(({ chatkit, children }: Props) => {
  const { currentUser, isLoading } = chatkit;
  const [currentRoomId, setCurrentRoomId] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [footer, setFooter] = React.useState<string>();
  const [participants, setParticipants] = React.useState<PusherUser[]>([]);
  const [messages, setMessages] = React.useState<GiftedMessage[]>([]);

  const onInputTextChanged = async (text: string) => {
    if (text.length) {
      await currentUser.isTypingIn({ roomId: currentRoomId });
    }
  };

  const onSend = async (messages: GiftedMessage[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for await (const message of messages) {
      currentUser.sendSimpleMessage({
        roomId: currentRoomId,
        text: message.text,
      });
    }
  };

  React.useEffect(() => {
    if (!currentRoomId) {
      return;
    }

    const onReadMessage = debounce((messageId) => {
      currentUser.setReadCursor({
        roomId: currentRoomId,
        position: messageId,
      });
    }, 200);

    const computeFooter = (newUsersWhoAreTyping: any) => {
      const keys = Object.keys(newUsersWhoAreTyping);
      let message;
      if (keys.length === 1) {
        const user = newUsersWhoAreTyping[keys[0]];
        message = `${user.name} is typing...`;
      } else if (keys.length > 1) {
        message = 'Multiple people are typing...';
      }
      setFooter(message);
    };

    const onUserStartedTyping = (user: PusherUser) => {
      usersWhoAreTypingBuffer[user.id] = user;
      computeFooter({ ...usersWhoAreTypingBuffer });
    };

    const onUserStoppedTyping = (user: PusherUser) => {
      delete usersWhoAreTypingBuffer[user.id];
      computeFooter({ ...usersWhoAreTypingBuffer });
    };

    const loadNewRoom = async () => {
      messageBuffer.length = 0;
      setMessages([]);

      setLoading(true);
      const room = await currentUser.subscribeToRoomMultipart({
        roomId: currentRoomId,
        hooks: {
          onMessage: (message: MessageFromPusher) => {
            const newMessage: GiftedMessage = {
              id: message.id,
              text: getPayload(message),
              user: message.sender,
              createdAt: new Date(message.createdAt),
            };
            messageBuffer.push(newMessage);
            setMessages([...messageBuffer]);
            onReadMessage(newMessage.id);
          },
          onUserStartedTyping,
          onUserStoppedTyping,
        },
        messageLimit: 20,
      });
      setParticipants(room.users);
      setLoading(false);
    };
    loadNewRoom();

    // Remember to unsubscribe after each room change.
    // eslint-disable-next-line consistent-return
    return () => {
      currentUser.roomSubscriptions[currentRoomId].cancel();
    };
  }, [currentRoomId]);

  if (isLoading || !currentUser || !currentRoomId) {
    return (
      <ChatRoomContext.Provider value={{ ...defaultState, setCurrentRoomId }}>
        {children}
      </ChatRoomContext.Provider>
    );
  }

  return (
    <ChatRoomContext.Provider
      value={{
        loading,
        currentRoomId,
        messages,
        participants,
        footer,
        onSend,
        onInputTextChanged,
        setCurrentRoomId,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
});
