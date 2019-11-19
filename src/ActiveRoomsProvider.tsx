import * as React from 'react';
import { identity, sortBy } from 'lodash-es';
import { addGlobalHook } from './common';
import { PusherRoom } from './interfaces';

const { withChatkit } = require('@pusher/chatkit-client-react');

interface CreateRoomParams {
  id?: string,
  name: string,
}

export interface ActiveRoomsState {
  loading: boolean,
  activeRooms: PusherRoom[],
  joinableRooms: PusherRoom[], // TODO: Remove after we put this into hostmaker-api.
  createRoom(room: CreateRoomParams): void, // TODO: Remove after we put this into hostmaker-api.
}

export const ActiveRoomsContext = React.createContext<ActiveRoomsState>({
  loading: true,
  activeRooms: [],
  joinableRooms: [],
  createRoom: identity,
});

const sortRooms = (rooms: PusherRoom[]) => sortBy(rooms, ({ unreadCount, name }) => `${9999 - unreadCount}-${name}`);

interface Props {
  chatkit: any,
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
    chatkit.currentUser.enablePushNotifications();

    const getRooms = async () => {
      const joinableRooms = await currentUser.getJoinableRooms();
      setJoinableRooms(joinableRooms);
      setLoading(false);
    };
    getRooms();

    const onAddedToRoom = (addedRoom: PusherRoom) => {
      const sortedRooms = sortRooms([addedRoom, ...activeRooms]);
      setActiveRooms(sortedRooms);
    };
    addGlobalHook(chatkit, 'onAddedToRoom', onAddedToRoom);

    const onRemovedFromRoom = (removedRoom: PusherRoom) => {
      setActiveRooms(activeRooms.filter(room => room.id !== removedRoom.id));
    };
    addGlobalHook(chatkit, 'onRemovedFromRoom', onRemovedFromRoom);

    const onRoomUpdated = (updatedRoom: PusherRoom) => {
      const newRooms = activeRooms.filter(room => room.id !== updatedRoom.id);
      newRooms.push(updatedRoom);
      const sortedRooms = sortRooms(newRooms);
      setActiveRooms(sortedRooms);
    };
    addGlobalHook(chatkit, 'onRoomUpdated', onRoomUpdated);
  }, []);

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
