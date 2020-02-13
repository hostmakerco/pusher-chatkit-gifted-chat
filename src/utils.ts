import { get } from 'lodash';
import { PusherMessage } from '@pusher/chatkit-client';
import { GiftedMessage, MessagePart } from './interfaces';

const getPayload = (message: MessagePart) => get(
  // TODO: check if type of payload is image, then do getImage
  message,
  'payload.content', message.partType !== 'url' ? 'Cannot render this message' : ''
);

const getImage = (message: MessagePart) => get(
  message,
  'payload.url', ''
);

export function toGiftedChatMessage(message: PusherMessage): GiftedMessage {
  const { parts = [] } = message;

  const messageText = getPayload(parts[0]);
  const messageImage = getImage(parts[0]);

  return {
    id: message.id.toString(),
    _id: message.id.toString(),
    text: messageText,
    user: { ...message.sender, _id: message.sender.id },
    createdAt: new Date(message.createdAt),
    image: messageImage,
  };
}
