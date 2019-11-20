export interface PusherUser {
  avatarURL?: string,
  createdAt: string,
  customData?: any,
  id: string,
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

export interface GiftedMessage {
  id: string,
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
