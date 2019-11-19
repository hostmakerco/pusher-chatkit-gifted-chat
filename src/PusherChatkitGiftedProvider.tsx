import * as React from 'react';
import { PusherProvider } from './PusherProvider';
import { ActiveRoomsProvider } from './ActiveRoomsProvider';
import { ChatRoomProvider } from './ChatRoomProvider';

interface Props {
  userId: string,
  instanceLocator: string,
  tokenProvider: () => string,
  children: React.ReactChild,
}

export const HostmakerChatProvider = ({ userId, instanceLocator, tokenProvider, children }: Props) => {
  const userIdIsString = typeof userId === 'string';
  if (!userId || !userIdIsString) {
    throw new Error('Please ensure you set userId to a string otherwise chat won\'t work!');
  }

  return (
    <PusherProvider
      userId={userId}
      instanceLocator={instanceLocator}
      tokenProvider={tokenProvider}
    >
      <ActiveRoomsProvider>
        <ChatRoomProvider>
          {children}
        </ChatRoomProvider>
      </ActiveRoomsProvider>
    </PusherProvider>
  );
};
