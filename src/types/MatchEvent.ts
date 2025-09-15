export interface BaseEvent {
  type: string;
  timestamp?: number;
  id?: string;
}

export interface BallEvent extends BaseEvent {
  type: 'BALL';
  payload: {
    runs: number;
    commentary: string;
    over?: number;
    ball?: number;
  };
}

export interface BoundaryEvent extends BaseEvent {
  type: 'BOUNDARY';
  payload: {
    runs: number;
    commentary: string;
    over?: number;
    ball?: number;
  };
}

export interface WicketEvent extends BaseEvent {
  type: 'WICKET';
  payload: {
    playerOut: string;
    dismissal: string;
    commentary: string;
    over?: number;
    ball?: number;
  };
}

export interface MatchStatusEvent extends BaseEvent {
  type: 'MATCH_STATUS';
  payload: {
    status: string;
    summary: string;
  };
}

export interface UnknownEvent extends BaseEvent {
  type: string;
  payload: any;
}

export type MatchEvent = BallEvent | BoundaryEvent | WicketEvent | MatchStatusEvent | UnknownEvent;

export interface PlayerStats {
  runs: number;
  balls: number;
  isOut: boolean;
}

export interface MatchState {
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  currentBatsmen: string[];
  currentBowler: string;
  matchStatus: string;
  getPlayerStats?: (playerName: string) => PlayerStats;
}