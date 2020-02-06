import { get } from 'lodash';
import { GiftedMessage, MessageFromPusher, MessagePart } from './interfaces';

const getPayload = (message: MessagePart) => get(
  // check if type of payload is image, then do getImage
  message,
  'payload.content', message.partType !== 'url' ? 'Cannot render this message' : ''
);

const getImage = (message: MessagePart) => get(
  message,
  'payload.url', ''
);

export function toGiftedChatMessage(message: MessageFromPusher): GiftedMessage {
  const { parts = [] } = message;

  const messageText = getPayload(parts[0]);
  const messageImage = getImage(parts[0]);

  return {
    id: message.id,
    _id: message.id,
    text: messageText,
    user: { ...message.sender, _id: message.sender.id },
    createdAt: new Date(message.createdAt),
    image: messageImage,
  };
}
