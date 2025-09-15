import { io, Socket } from 'socket.io-client';
import { MatchEvent } from '../types/MatchEvent';

export interface SocketConfig {
    url: string;
    options?: {
        transports?: string[];
        timeout?: number;
        forceNew?: boolean;
    };
}

export class SocketEventStream {
    private socket: Socket | null = null;
    private listeners: ((event: MatchEvent) => void)[] = [];
    private connectionListeners: ((connected: boolean) => void)[] = [];
    private errorListeners: ((error: string) => void)[] = [];
    private isConnected = false;
    private config: SocketConfig;

    constructor(config: SocketConfig) {
        this.config = config;
    }

    subscribe(callback: (event: MatchEvent) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    onConnectionChange(callback: (connected: boolean) => void): () => void {
        this.connectionListeners.push(callback);
        return () => {
            this.connectionListeners = this.connectionListeners.filter(
                listener => listener !== callback
            );
        };
    }

    onError(callback: (error: string) => void): () => void {
        this.errorListeners.push(callback);
        return () => {
            this.errorListeners = this.errorListeners.filter(
                listener => listener !== callback
            );
        };
    }

    connect(): void {
        if (this.socket?.connected) {
            return;
        }

        console.log('Connecting socket to', this.config.url, 'with options', this.config.options);

        try {

            this.socket = io(this.config.url, {
                ...this.config.options,
            });

            this.setupEventListeners();
        } catch (error) {
            console.error('❌ Failed to create socket connection:', error);
            this.notifyError(`Failed to create socket connection: ${String(error)}`);
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.notifyConnectionChange(false);
        }
    }

    get connected(): boolean {
        return this.isConnected && this.socket?.connected === true;
    }

    joinMatch(matchId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('join_match', { matchId });
        } else {
            console.warn('Socket not connected. Cannot join match.');
        }
    }

    leaveMatch(matchId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('leave_match', { matchId });
        }
    }

    requestMatchHistory(matchId: string): void {
        if (this.socket?.connected) {
            this.socket.emit('get_match_history', { matchId });
        }
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
            this.notifyConnectionChange(true);
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.notifyConnectionChange(false);
        });

        this.socket.on('connect_error', (error) => {
            console.log('🚨 connect_error', error);

            
            let errorMessage = 'Connection failed';
            
            if (error && typeof error === 'object') {
                if (error.message) {
                    errorMessage = `Connection failed: ${error.message}`;
                } else if (error.description) {
                    errorMessage = `Connection failed: ${error.description}`;
                } else if (error.type) {
                    errorMessage = `Connection failed: ${error.type}`;
                } else {
                    errorMessage = `Connection failed: ${JSON.stringify(error)}`;
                }
            } else {
                errorMessage = `Connection failed: ${String(error)}`;
            }
            
            console.error('Final error message:', errorMessage);
            this.notifyError(errorMessage);
        });

        this.socket.on('match_event', (data: MatchEvent) => {
            this.notifyListeners(data);
        });

        this.socket.on('ball_event', (data: MatchEvent) => {
            this.notifyListeners(data);
        });

        this.socket.on('boundary_event', (data: MatchEvent) => {
            this.notifyListeners(data);
        });

        this.socket.on('wicket_event', (data: MatchEvent) => {
            this.notifyListeners(data);
        });

        this.socket.on('match_status_event', (data: MatchEvent) => {
            this.notifyListeners(data);
        });

        this.socket.on('match_history', (data: { events: MatchEvent[] }) => {
            data.events.forEach(event => this.notifyListeners(event));
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.notifyError(`Socket error: ${error}`);
        });

        this.socket.on('reconnect', (attemptNumber) => {
            this.isConnected = true;
            this.notifyConnectionChange(true);
        });

        this.socket.on('reconnect_error', (error) => {
            console.error('Socket reconnection error:', error);
            this.notifyError(`Reconnection error: ${error.message}`);
        });
    }

    private notifyListeners(event: MatchEvent): void {
        const eventWithTimestamp = {
            ...event,
            timestamp: event.timestamp || Date.now(),
            id: event.id || `${Date.now()}-${Math.random()}`,
        };

        this.listeners.forEach(listener => {
            try {
                listener(eventWithTimestamp);
            } catch (error) {
                console.error('Error in event listener:', error);
            }
        });
    }

    private notifyConnectionChange(connected: boolean): void {
        this.connectionListeners.forEach(listener => {
            try {
                listener(connected);
            } catch (error) {
                console.error('Error in connection listener:', error);
            }
        });
    }

    private notifyError(error: string): void {
        this.errorListeners.forEach(listener => {
            try {
                listener(error);
            } catch (error) {
                console.error('Error in error listener:', error);
            }
        });
    }
}