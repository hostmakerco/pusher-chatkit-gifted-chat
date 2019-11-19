import * as React from 'react';
import get from 'lodash.get';

export const useChatkitGlobalHook = (chatkit: any, name: string, hook: Function) => (
  React.useEffect(() => {
    addGlobalHook(chatkit, name, hook);
    return () => removeGlobalHook(chatkit, name);
  }, [])
);

export function addGlobalHook(chatkit: any, name: string, hook: Function) {
  const globalHooks = get(chatkit, 'chatManager.currentUser.hooks.global');
  globalHooks[name] = hook;
}

export function removeGlobalHook(chatkit: any, name: string) {
  const globalHooks = get(chatkit, 'chatManager.currentUser.hooks.global');
  globalHooks[name] = undefined;
}

export function identity() {}
