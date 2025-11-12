import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  namespace: 'notifications',
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  // Map userId => Set of socket ids
  private clients = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  afterInit() {
    this.logger.log('Notifications gateway initialized');
  }

  handleConnection(client: Socket) {
    try {
      // Accept token via query param ?token=JWT or via headers
      const token = client.handshake.query?.token || client.handshake.auth?.token;
      if (!token || typeof token !== 'string') {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'devsphere_secret' });
      const userId = payload.sub;
      if (!userId) {
        client.disconnect();
        return;
      }

      // register socket
      const set = this.clients.get(userId) ?? new Set<string>();
      set.add(client.id);
      this.clients.set(userId, set);
      client.data.userId = userId;

      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
    } catch (err) {
      this.logger.warn('WS auth failed:', err?.message || err);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;
    const set = this.clients.get(userId);
    if (set) {
      set.delete(client.id);
      if (set.size === 0) this.clients.delete(userId);
    }
    this.logger.log(`Client disconnected: ${client.id} (user: ${userId})`);
  }

  // Emit to a specific user's sockets
  emitToUser(userId: string, event: string, payload: any) {
    const set = this.clients.get(userId);
    if (!set) return;
    set.forEach(socketId => {
      this.server.to(socketId).emit(event, payload);
    });
  }
}
