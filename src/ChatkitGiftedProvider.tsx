import * as React from 'react';
import { ActiveRoomsProvider } from './ActiveRoomsProvider';
import { ChatRoomProvider } from './ChatRoomProvider';
import { ChatKitSessionProvider } from './ChatkitSessionProvider';

const { ChatkitProvider } = require('@pusher/chatkit-client-react');

interface Props {
  userId: string,
  instanceLocator: string,
  tokenProvider: () => string,
  children: React.ReactChild,
}

export const ChatkitGiftedProvider = ({ userId, instanceLocator, tokenProvider, children }: Props) => {
  if (!userId) {
    throw new Error('Please ensure you set userId otherwise ChatkitGiftedProvider won\'t work!');
  }

  return (
    <ChatkitProvider
      instanceLocator={instanceLocator}
      tokenProvider={tokenProvider}
      userId={userId.toString()}
    >
      <ChatKitSessionProvider>
        <ActiveRoomsProvider>
          <ChatRoomProvider>
            {children}
          </ChatRoomProvider>
        </ActiveRoomsProvider>
      </ChatKitSessionProvider>
    </ChatkitProvider>
  );
};
