import * as React from 'react';
import { sortBy } from 'lodash';
import { PusherRoom } from '@pusher/chatkit-client';
import { useChatkitGlobalHook, identity } from './common';
import { PusherChatkit } from './interfaces';

const { withChatkit } = require('@pusher/chatkit-client-react');

interface CreateRoomParams {
  id?: string,
  name: string,
}

export interface ActiveRoomsState {
  loading: boolean,
  activeRooms: PusherRoom[],
  joinableRooms: PusherRoom[],
  createRoom(room: CreateRoomParams): void,
}

export const ActiveRoomsContext = React.createContext<ActiveRoomsState>({
  loading: true,
  activeRooms: [],
  joinableRooms: [],
  createRoom: identity,
});

const sortRooms = (rooms: PusherRoom[]) => sortBy(rooms, ({ unreadCount, name }) => `${9999 - unreadCount}-${name}`);

interface Props {
  chatkit: PusherChatkit,
  children: React.ReactChild,
}

export const ActiveRoomsProvider = withChatkit(({ chatkit, children }: Props) => {
  const { currentUser, isLoading } = chatkit;
  if (isLoading || !currentUser) {
    return null;
  }

  const [loading, setLoading] = React.useState<boolean>(true);
  const [activeRooms, setActiveRooms] = React.useState<PusherRoom[]>(sortRooms(currentUser.rooms));
  const [joinableRooms, setJoinableRooms] = React.useState<PusherRoom[]>([]);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      chatkit.currentUser.enablePushNotifications();
    }
  }, []);

  React.useEffect(() => {
    const getRooms = async () => {
      const joinableRooms = await currentUser.getJoinableRooms();
      setJoinableRooms(joinableRooms);
      setLoading(false);
    };
    getRooms();
  }, []);

  const onAddedToRoom = (addedRoom: PusherRoom) => {
    setActiveRooms(prev => sortRooms([addedRoom, ...prev]));
  };
  useChatkitGlobalHook(chatkit, 'onAddedToRoom', onAddedToRoom);

  const onRemovedFromRoom = (removedRoom: PusherRoom) => {
    setActiveRooms(prev => prev.filter(room => room.id !== removedRoom.id));
  };
  useChatkitGlobalHook(chatkit, 'onRemovedFromRoom', onRemovedFromRoom);

  const onRoomUpdated = (updatedRoom: PusherRoom) => {
    setActiveRooms((prev) => {
      const newRooms = prev.filter(room => room.id !== updatedRoom.id);
      newRooms.push(updatedRoom);
      return sortRooms(newRooms);
    });
  };
  useChatkitGlobalHook(chatkit, 'onRoomUpdated', onRoomUpdated);

  return (
    <ActiveRoomsContext.Provider
      value={{
        loading,
        activeRooms,
        joinableRooms,
        createRoom: currentUser.createRoom,
      }}
    >
      {children}
    </ActiveRoomsContext.Provider>
  );
});
