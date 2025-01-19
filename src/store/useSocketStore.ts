// stores/socketStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';

interface SocketStore {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,

  connectSocket: () => {
    const socket = io(SOCKET_SERVER_URL);
    console.log('socket connected');
    set({ socket });
  },

  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      console.log('socket disconnected');
      return { socket: null };
    });
  },
}));
