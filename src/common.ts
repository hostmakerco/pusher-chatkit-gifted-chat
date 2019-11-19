import { get } from 'lodash-es';

export function addGlobalHook(chatkit: any, name: string, hook: Function) {
  const globalHooks = get(chatkit, 'chatManager.currentUser.hooks.global');
  globalHooks[name] = hook;
}
