import { io, Socket } from "socket.io-client";
import { createContext, useContext } from "react";

const socket = io(process.env.REACT_APP_SOCKET_URL ?? "", {
  extraHeaders: {
    raccoon: "true",
  },
});

export const SocketContext = createContext<Socket>(socket);

export const useSocket = (): Socket => useContext(SocketContext);

export const SocketProvider: React.FC = ({ children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);
