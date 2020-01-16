export interface PusherUser {
  avatarURL?: string,
  createdAt: string,
  customData?: any,
  id: string,
  name: string,
  updatedAt: string,
}

export interface GiftedUser {
  avatarURL?: string,
  createdAt: string,
  customData?: any,
  id: string,
  _id: string,
  name: string,
  updatedAt: string,
}

export interface PusherRoom {
  id: string,
  createdAt: string,
  createdByUserId: string,
  customData?: any,
  isPrivate: boolean,
  lastMessageAt: string,
  name: string,
  unreadCount: number,
  updatedAt: string,
  userIds: string[],
}

export interface MessagePart {
  partType: 'inline' | 'url' | 'attachment',
  payload: any,
}

export interface MessageFromPusher {
  id: string,
  parts: MessagePart[],
  sender: PusherUser,
  createdAt: Date,
}

export interface GiftedMessage {
  id: string, // This is used by react-web-gifted-chat
  _id: string, // This is used by react-native-gifted-chat
  text: string,
  user: GiftedUser,
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
