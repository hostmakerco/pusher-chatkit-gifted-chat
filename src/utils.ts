import { get } from 'lodash';
import { GiftedMessage, MessageFromPusher } from './interfaces';

const getPayload = (message: MessageFromPusher) => get(
  message,
  'parts[0].payload.content', 'Cannot render this message'
);

export function toGiftedChatMessage(message: MessageFromPusher): GiftedMessage {
  return {
    id: message.id,
    _id: message.id,
    text: getPayload(message),
    user: message.sender,
    createdAt: new Date(message.createdAt),
  };
}
