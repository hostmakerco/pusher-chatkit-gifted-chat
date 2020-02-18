import * as React from 'react';
import { debounce } from 'lodash';
import { PusherUser, PusherMessage } from '@pusher/chatkit-client';
import { identity } from './common';
import { PusherChatkit, GiftedMessage, ChatRoomState } from './interfaces';
import { toGiftedChatMessage } from './utils';

const { withChatkit } = require('@pusher/chatkit-client-react');

interface Props {
  chatkit: PusherChatkit,
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
  onSendAttachment: identity,
  onInputTextChanged: identity,
};

export const ChatRoomContext = React.createContext<ChatRoomState>(defaultState);

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
    if (!currentRoomId) {
      return;
    }

    if (text.length) {
      await currentUser.isTypingIn({ roomId: currentRoomId });
    }
  };

  const onSend = async (messages: GiftedMessage[]) => {
    if (!currentRoomId) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const message of messages) {
      currentUser.sendSimpleMessage({
        roomId: currentRoomId,
        text: message.text,
      });
    }
  };

  const onSendAttachment = async (attachmentUrl: string) => {
    if (!currentRoomId) {
      return;
    }

    currentUser.sendMultipartMessage({
      roomId: currentRoomId,
      parts: [{
        type: 'image/jpeg',
        url: attachmentUrl,
      }],
    });
  };

  React.useEffect(() => {
    if (!currentRoomId) {
      return;
    }

    const onReadMessage = debounce((messageId: number) => {
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
          onMessage: (message: PusherMessage) => {
            const newMessage = toGiftedChatMessage(message);
            messageBuffer.push(newMessage);
            setMessages([...messageBuffer]);
            onReadMessage(message.id);
          },
          onUserStartedTyping,
          onUserStoppedTyping,
        },
        messageLimit: 20,
      });
      if (!room) {
        return;
      }
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
        onSendAttachment,
        onInputTextChanged,
        setCurrentRoomId,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  );
});
