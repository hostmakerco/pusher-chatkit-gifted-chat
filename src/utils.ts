import { get } from 'lodash';
import { GiftedMessage, MessageFromPusher } from './interfaces';

const getPayload = (message: MessageFromPusher) => get(
  message,
  'parts[0].payload.content', 'Cannot render this message'
);

const getImage = (message: MessageFromPusher) => get(
  message,
  'parts[0].url'
)

export function toGiftedChatMessage(message: MessageFromPusher): GiftedMessage {
  return {
    id: message.id,
    _id: message.id,
    text: getPayload(message),
    user: { ...message.sender, _id: message.sender.id },
    createdAt: new Date(message.createdAt),
    image: getImage(message),
  };
}
