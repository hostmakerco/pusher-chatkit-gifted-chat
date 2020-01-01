import { get } from 'lodash';
import { PusherMessage } from '@pusher/chatkit-client';
import { GiftedMessage } from './interfaces';

const getPayload = (message: PusherMessage) => get(
  message,
  'parts[0].payload.content', 'Cannot render this message'
);

export function toGiftedChatMessage(message: PusherMessage): GiftedMessage {
  return {
    id: message.id.toString(),
    _id: message.id.toString(),
    text: getPayload(message),
    user: message.sender,
    createdAt: new Date(message.createdAt),
  };
}
