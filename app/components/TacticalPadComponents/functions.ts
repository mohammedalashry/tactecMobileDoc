import {SkPath, SkRect} from '@shopify/react-native-skia';
type Team = 'home' | 'away';
type Formation = string;

export interface PlayerPosition {
  id: string;
  position: string;
  x: number;
  y: number;
  team: Team;
  shirtNumber?: number;
}
interface Player {
  x: number;
  y: number;
  id: string;
  position: Position;
  team: Team;
}
type Position =
  | 'GK' // Goalkeeper
  | 'SW' // Sweeper
  | 'LB' // Left Back
  | 'LCB' // Left Center Back
  | 'CB' // Center Back
  | 'RCB' // Right Center Back
  | 'RB' // Right Back
  | 'LWB' // Left Wing Back
  | 'RWB' // Right Wing Back
  | 'CDM' // Central Defensive Midfielder
  | 'LDM' // Left Defensive Midfielder
  | 'RDM' // Right Defensive Midfielder
  | 'LM' // Left Midfielder
  | 'LCM' // Left Central Midfielder
  | 'CM' // Central Midfielder
  | 'RCM' // Right Central Midfielder
  | 'RM' // Right Midfielder
  | 'CAM' // Central Attacking Midfielder
  | 'LAM' // Left Attacking Midfielder
  | 'RAM' // Right Attacking Midfielder
  | 'LW' // Left Winger
  | 'RW' // Right Winger
  | 'CF' // Center Forward
  | 'SS' // Second Striker
  | 'ST'
  | 'DM'; // Striker

function assignPosition(
  lineIndex: number,
  playerIndex: number,
  totalTeamLines: number,
): Position {
  if (lineIndex === 0) {
    const defensivePositions: Position[] = ['LB', 'CB', 'RB', 'LWB', 'RWB'];
    return defensivePositions[playerIndex] || 'CB';
  }
  if (lineIndex !== 0 || lineIndex !== totalTeamLines - 1) {
    const midfieldPositions: Position[] = ['DM', 'CM', 'LM', 'RM'];
    return midfieldPositions[playerIndex] || 'CM';
  }
  const attackingPositions: Position[] = ['LW', 'CF', 'RW', 'ST'];
  return attackingPositions[playerIndex] || 'ST';
}
export const getAllPlayers = (
  homeFormation: Formation,
  awayFormation: Formation,
  fieldWidth: number,
  fieldHeight: number,
  playerSize: number,
) => {
  const availableWidth = fieldWidth * 0.85;
  const homeLines = homeFormation.split('-').map(Number);
  const awayLines = awayFormation.split('-').map(Number);
  const totalLinesCount = homeLines.length + awayLines.length;
  const lineSpacing = availableWidth / (totalLinesCount + 1);
  const verticalPadding = fieldHeight * 0.1;
  //const lineSize=lineSpacing+playerSize;
  const players: Player[] = [];
  //const formations = [homeFormation, awayFormation];
  const teams: Team[] = ['home', 'away'];
  let lines: {
    line: number;
    lineValue: number;
    team: Team;
    teamLineIndex: number;
  }[] = [];
  let currentLineHome = 0;
  let currentLineAway = awayLines.length - 1;
  console.log('total lines', totalLinesCount);
  for (let i = 0; i < totalLinesCount; i++) {
    if (i === 0) {
      const currentLineValue = homeLines[0];
      lines.push({
        line: i,
        lineValue: currentLineValue,
        team: teams[0],
        teamLineIndex: 0,
      });
    } else {
      const currentLineValue =
        i % 2 === 1 ? awayLines[currentLineAway] : homeLines[currentLineHome];
      lines.push({
        line: i,
        lineValue: currentLineValue,
        team: teams[i % 2],
        teamLineIndex: i % 2 === 0 ? currentLineHome : currentLineAway,
      });
    }
    if (i % 2 === 1) {
      currentLineHome++;
      currentLineAway--;
    }
  }
  console.log('lines', lines);
  players.push({
    id: 'h1',
    x: 0.05 * fieldWidth,
    y: fieldHeight * 0.5 - playerSize / 2,
    team: 'home',
    position: 'GK',
  });
  players.push({
    id: 'a1',
    x: 0.9 * fieldWidth,
    y: fieldHeight * 0.5 - playerSize / 2,
    team: 'away',
    position: 'GK',
  });

  lines.forEach(line => {
    const team = line.team;
    const playersInLine = line.lineValue;
    const baseX = availableWidth * 0.05;
    const x = baseX + lineSpacing * (line.line + 1);
    for (let i = 0; i < playersInLine; i++) {
      const y =
        verticalPadding +
        ((fieldHeight - 2 * verticalPadding) * (i + 1)) / (playersInLine + 1) -
        playerSize / 2;
      players.push({
        id: `${team == 'home' ? 'h' : 'a'}${
          players.filter(p => p.team === team).length + 1
        }`,
        x,
        y,
        team,
        position: assignPosition(
          line.teamLineIndex,
          i,
          line.team === 'home' ? homeLines.length : awayLines.length,
        ),
      });
    }
  });
  console.log('players', players);
  return players;
};
//////////////////////////////// Second Way ////////////////////

const FORMATIONS = {
  '4-3-1-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'CM', x: 0.3, y: 0.3},
    {position: 'CM', x: 0.3, y: 0.5},
    {position: 'CM', x: 0.3, y: 0.7},
    {position: 'CAM', x: 0.38, y: 0.5},
    {position: 'ST', x: 0.47, y: 0.4},
    {position: 'ST', x: 0.47, y: 0.6},
  ],
  '4-4-1-1': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'LM', x: 0.3, y: 0.2},
    {position: 'CM', x: 0.3, y: 0.4},
    {position: 'CM', x: 0.3, y: 0.6},
    {position: 'RM', x: 0.3, y: 0.8},
    {position: 'CAM', x: 0.38, y: 0.5},
    {position: 'ST', x: 0.47, y: 0.5},
  ],
  '4-3-2-1': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'CM', x: 0.32, y: 0.3},
    {position: 'CM', x: 0.32, y: 0.5},
    {position: 'CM', x: 0.32, y: 0.7},
    {position: 'CAM', x: 0.4, y: 0.35},
    {position: 'ST', x: 0.4, y: 0.65},
    {position: 'ST', x: 0.47, y: 0.5},
  ],
  '4-2-3-1': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'CM', x: 0.3, y: 0.4},
    {position: 'CM', x: 0.3, y: 0.6},
    {position: 'LW', x: 0.38, y: 0.2},
    {position: 'CAM', x: 0.38, y: 0.5},
    {position: 'RW', x: 0.38, y: 0.8},
    {position: 'ST', x: 0.47, y: 0.5},
  ],
  '4-5-1': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'LM', x: 0.35, y: 0.2},
    {position: 'CM', x: 0.32, y: 0.35},
    {position: 'CM', x: 0.32, y: 0.5},
    {position: 'DM', x: 0.32, y: 0.65},
    {position: 'RM', x: 0.35, y: 0.8},
    {position: 'ST', x: 0.45, y: 0.5},
  ],
  '4-2-2-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'CM', x: 0.32, y: 0.4},
    {position: 'CM', x: 0.32, y: 0.6},
    {position: 'LW', x: 0.4, y: 0.2},
    {position: 'RW', x: 0.4, y: 0.8},
    {position: 'ST', x: 0.46, y: 0.4},
    {position: 'ST', x: 0.46, y: 0.6},
  ],
  '4-4-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'LM', x: 0.35, y: 0.2},
    {position: 'CM', x: 0.35, y: 0.4},
    {position: 'CM', x: 0.35, y: 0.6},
    {position: 'RM', x: 0.35, y: 0.8},
    {position: 'ST', x: 0.45, y: 0.4},
    {position: 'ST', x: 0.45, y: 0.6},
  ],
  '4-3-3': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.2, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.4},
    {position: 'CB', x: 0.2, y: 0.6},
    {position: 'RB', x: 0.2, y: 0.8},
    {position: 'CM', x: 0.35, y: 0.3},
    {position: 'CM', x: 0.35, y: 0.5},
    {position: 'CM', x: 0.35, y: 0.7},
    {position: 'LW', x: 0.45, y: 0.2},
    {position: 'ST', x: 0.45, y: 0.5},
    {position: 'RW', x: 0.45, y: 0.8},
  ],
  '5-2-2-1': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.23, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.35},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.65},
    {position: 'RB', x: 0.23, y: 0.8},
    {position: 'CDM', x: 0.32, y: 0.4},
    {position: 'LW', x: 0.32, y: 0.6},
    {position: 'RW', x: 0.4, y: 0.7},
    {position: 'CAM', x: 0.4, y: 0.3},
    {position: 'ST', x: 0.45, y: 0.5},
  ],
  '3-4-3': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.3},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.7},
    {position: 'LM', x: 0.32, y: 0.2},
    {position: 'CM', x: 0.32, y: 0.4},
    {position: 'CM', x: 0.32, y: 0.6},
    {position: 'RM', x: 0.32, y: 0.8},
    {position: 'LW', x: 0.45, y: 0.3},
    {position: 'ST', x: 0.45, y: 0.5},
    {position: 'RW', x: 0.45, y: 0.7},
  ],
  '3-4-1-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.3},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.7},
    {position: 'LM', x: 0.32, y: 0.2},
    {position: 'CM', x: 0.32, y: 0.4},
    {position: 'CM', x: 0.32, y: 0.6},
    {position: 'RM', x: 0.32, y: 0.8},
    {position: 'CAM', x: 0.4, y: 0.5},
    {position: 'ST', x: 0.47, y: 0.4},
    {position: 'ST', x: 0.47, y: 0.6},
  ],
  '5-3-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.23, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.35},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.65},
    {position: 'RB', x: 0.23, y: 0.8},
    {position: 'CM', x: 0.35, y: 0.5},
    {position: 'LW', x: 0.35, y: 0.3},
    {position: 'RW', x: 0.35, y: 0.7},
    {position: 'ST', x: 0.47, y: 0.4},
    {position: 'ST', x: 0.47, y: 0.6},
  ],
  '3-4-2-1': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.3},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.7},
    {position: 'LM', x: 0.31, y: 0.2},
    {position: 'CM', x: 0.31, y: 0.4},
    {position: 'CM', x: 0.31, y: 0.6},
    {position: 'RM', x: 0.31, y: 0.8},
    {position: 'CAM', x: 0.4, y: 0.65},
    {position: 'ST', x: 0.4, y: 0.35},
    {position: 'ST', x: 0.47, y: 0.5},
  ],
  '5-2-1-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'LB', x: 0.23, y: 0.2},
    {position: 'CB', x: 0.2, y: 0.35},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.65},
    {position: 'RB', x: 0.23, y: 0.8},
    {position: 'CDM', x: 0.31, y: 0.4},
    {position: 'CDM', x: 0.31, y: 0.6},
    {position: 'CAM', x: 0.39, y: 0.5},
    {position: 'ST', x: 0.46, y: 0.4},
    {position: 'ST', x: 0.46, y: 0.6},
  ],
  '3-5-2': [
    {position: 'GK', x: 0.05, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.3},
    {position: 'CB', x: 0.2, y: 0.5},
    {position: 'CB', x: 0.2, y: 0.7},
    {position: 'LM', x: 0.33, y: 0.2},
    {position: 'CM', x: 0.33, y: 0.35},
    {position: 'CM', x: 0.33, y: 0.5},
    {position: 'CM', x: 0.33, y: 0.65},
    {position: 'RM', x: 0.33, y: 0.8},
    {position: 'LW', x: 0.45, y: 0.4},
    {position: 'RW', x: 0.45, y: 0.6},
  ],
};

export const getPlayersOnGround = (
  formation: string,
  team: Team,
  fieldWidth: number,
  fieldHeight: number,
  playerSize: number,
  isAlmeria: boolean,
): PlayerPosition[] => {
  const presetPositions = FORMATIONS[formation];

  if (!presetPositions) {
    console.error(`Formation ${formation} not found in presets`);
    return [];
  }

  const players: PlayerPosition[] = [];

  presetPositions.forEach((preset, index) => {
    let x = preset.x * fieldWidth - playerSize / 2;
    let y = preset.y * fieldHeight - playerSize / 2;

    // Flip x-coordinates for away team
    if (team === 'away') {
      x = fieldWidth * 0.95 - x;
    }

    players.push({
      id: `${team}-${index}`,
      position: preset.position,
      x,
      y,
      team,
      shirtNumber: isAlmeria ? '' : index + 1,
    });
  });

  return players;
};
export const isPointNearPath = (
  x: number,
  y: number,
  path: SkPath,
  threshold: number = 8,
) => {
  const bounds: SkRect = path.getBounds();
  if (
    x < bounds.x - threshold ||
    x > bounds.x + bounds.width + threshold ||
    y < bounds.y - threshold ||
    y > bounds.y + bounds.height + threshold
  ) {
    return false;
  }

  const numPoints = path.countPoints();
  console.log('numPoints', numPoints);
  for (let i = 0; i < numPoints - 1; i++) {
    const point1 = path.getPoint(i);
    const point2 = path.getPoint(i + 1);

    // Check if the point is near the line segment between point1 and point2
    const distanceToSegment = distanceToLineSegment(
      x,
      y,
      point1.x,
      point1.y,
      point2.x,
      point2.y,
    );

    if (distanceToSegment <= threshold) {
      return true;
    }
  }

  return false;
};

const distanceToLineSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0)
    // in case of 0 length line
    param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};
