import { useState, useEffect } from 'react';
import { MatchEvent, MatchState, PlayerStats } from '../types/MatchEvent';

export const useMatchState = (events: MatchEvent[]): MatchState => {
  const [totalRuns, setTotalRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [currentBatsmen, setCurrentBatsmen] = useState([
    'R. Sharma',
    'V. Kohli',
  ]);
  const [currentBowler, setCurrentBowler] = useState('');
  const [matchStatus, setMatchStatus] = useState('Not Started');
  const [playerStats, setPlayerStats] = useState<{
    [key: string]: PlayerStats;
  }>({});

  useEffect(() => {
    let newTotalRuns = 0;
    let newWickets = 0;
    let newBalls = 0;
    let newCurrentBatsmen = ['R. Sharma', 'V. Kohli'];
    let newCurrentBowler = '';
    let newMatchStatus = 'Not Started';
    let newPlayerStats: { [key: string]: PlayerStats } = {};

    events.forEach((event, index) => {
      switch (event.type) {
        case 'BALL':
        case 'BOUNDARY':
          const batsman = event.payload.batsman;
          const bowler = event.payload.bowler;
          const runs = event.payload.runs || 0;

          if (batsman) {
            if (!newPlayerStats[batsman]) {
              newPlayerStats[batsman] = { runs: 0, balls: 0, isOut: false };
            }
            newPlayerStats[batsman].runs += runs;
            newPlayerStats[batsman].balls += 1;
          }

          // Update current bowler
          if (bowler) {
            newCurrentBowler = bowler;
            console.log(event.payload,'event.payload');
            console.log(`🎳 Bowler updated to: ${bowler}`);
          }

          newTotalRuns += runs;
          newBalls += 1;
          break;
          
          case 'WICKET':
          const playerOut = event.payload.playerOut;
          const wicketBowler = event.payload.bowler;

          // Update bowler for wicket ball
          if (wicketBowler) {
            newCurrentBowler = wicketBowler;
            console.log(`🎳 Bowler updated to: ${wicketBowler} (wicket ball)`);
          }

          if (playerOut && newPlayerStats[playerOut]) {
            newPlayerStats[playerOut].isOut = true;
          }

          const outIndex = newCurrentBatsmen.indexOf(playerOut);

          if (outIndex !== -1) {
            let nextBatsman = '';
            if (playerOut === 'R. Sharma') nextBatsman = 'R. Pant';
            else if (playerOut === 'R. Pant') nextBatsman = 'S. Yadav';
            else if (playerOut === 'S. Yadav') nextBatsman = 'H. Pandya';
            else if (playerOut === 'H. Pandya') nextBatsman = 'R. Jadeja';
            else if (playerOut === 'Q. de Kock') nextBatsman = 'A. Markram';
            else if (playerOut === 'R. Hendricks') nextBatsman = 'A. Markram';
            else if (playerOut === 'A. Markram') nextBatsman = 'H. Klaasen';
            else if (playerOut === 'H. Klaasen') nextBatsman = 'D. Miller';
            else if (playerOut === 'D. Miller') nextBatsman = 'M. Jansen';

            if (nextBatsman) {
              const newBatsmenArray = [...newCurrentBatsmen];
              newBatsmenArray[outIndex] = nextBatsman;
              newCurrentBatsmen = newBatsmenArray;
              console.log(
                `✅ Replaced ${playerOut} with ${nextBatsman} at index ${outIndex}`,
              );
            }
          }

          newWickets += 1;
          newBalls += 1;
          break;

        case 'MATCH_STATUS':
          newMatchStatus = event.payload.status;
          if (event.payload.status === 'Chase Begins') {
            newCurrentBatsmen = ['Q. de Kock', 'R. Hendricks'];
          }
          break;
      }
    });

    setTotalRuns(newTotalRuns);
    setWickets(newWickets);
    setBalls(newBalls);
    setCurrentBatsmen([...newCurrentBatsmen]);
    setCurrentBowler(newCurrentBowler);
    setMatchStatus(newMatchStatus);
    setPlayerStats({ ...newPlayerStats });
  }, [events]);

  return {
    totalRuns,
    wickets,
    overs: Math.floor(balls / 6),
    balls,
    currentBatsmen,
    currentBowler,
    matchStatus,
    getPlayerStats: (playerName: string) => {
      const stats = playerStats[playerName];
      return stats || { runs: 0, balls: 0, isOut: false };
    },
  };
};
