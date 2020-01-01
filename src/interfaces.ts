import { CurrentUser, PusherUser } from '@pusher/chatkit-client';

export interface PusherChatkit {
  currentUser: CurrentUser,
  isLoading: boolean,
}

export interface MessagePart {
  partType: 'inline' | 'url' | 'attachment',
  payload: any,
}

export interface GiftedMessage {
  id: string, // This is used by react-web-gifted-chat
  _id: string, // This is used by react-native-gifted-chat
  text: string,
  user: PusherUser,
  createdAt: Date,
}

export interface ChatRoomState {
  loading: boolean,
  currentRoomId?: string,
  messages: GiftedMessage[],
  participants: PusherUser[],
  footer?: string,
  onSend(messages: GiftedMessage[]): void,
  onInputTextChanged(inputText: string): void,
  setCurrentRoomId(roomId: string): void,
}
