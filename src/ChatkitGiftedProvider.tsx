import * as React from 'react';
const { ChatkitProvider } = require('@pusher/chatkit-client-react');
import { ActiveRoomsProvider } from './ActiveRoomsProvider';
import { ChatRoomProvider } from './ChatRoomProvider';

interface Props {
  userId: string,
  instanceLocator: string,
  tokenProvider: () => string,
  children: React.ReactChild,
}

export const ChatkitGiftedProvider = ({ userId, instanceLocator, tokenProvider, children }: Props) => {
  const userIdIsString = typeof userId === 'string';
  if (!userId || !userIdIsString) {
    throw new Error('Please ensure you set userId to a string otherwise chat won\'t work!');
  }

  return (
    <ChatkitProvider
      instanceLocator={instanceLocator}
      tokenProvider={tokenProvider}
      userId={userId}
    >
      <ActiveRoomsProvider>
        <ChatRoomProvider>
          {children}
        </ChatRoomProvider>
      </ActiveRoomsProvider>
    </ChatkitProvider>
  );
};
