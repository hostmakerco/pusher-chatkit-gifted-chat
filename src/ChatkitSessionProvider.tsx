import * as React from 'react';
import { identity } from './common';
import { ChatKitSessionState } from './interfaces';

const { withChatkit } = require('@pusher/chatkit-client-react');

interface Props {
  chatkit: any,
  children: React.ReactChild,
}

const defaultState: ChatKitSessionState = {
  disconnect: identity,
};

export const ChatKitSessionContext = React.createContext<ChatKitSessionState>(defaultState);

export const ChatKitSessionProvider = withChatkit(({ chatkit, children }: Props) => {
  const { currentUser, isLoading } = chatkit;

  if (isLoading || !currentUser) {
    return (
      <ChatKitSessionContext.Provider value={{ ...defaultState }}>
        {children}
      </ChatKitSessionContext.Provider>
    );
  }

  return (
    <ChatKitSessionContext.Provider
      value={{
        disconnect: currentUser.disconnect(),
      }}
    >
      {children}
    </ChatKitSessionContext.Provider>
  );
});
