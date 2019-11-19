import * as React from 'react';

const { ChatkitProvider } = require('@pusher/chatkit-client-react');

interface Props {
  children: React.ReactChild,
  userId: string,
  instanceLocator: string,
  tokenProvider: () => string,
}

export const PusherProvider = ({ children, userId, instanceLocator, tokenProvider }: Props) => (
  <ChatkitProvider
    instanceLocator={instanceLocator}
    tokenProvider={tokenProvider}
    userId={userId}
  >
    {children}
  </ChatkitProvider>
);
