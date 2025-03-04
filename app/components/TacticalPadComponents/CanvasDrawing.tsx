import {
  Path,
  Canvas,
  Skia,
  useTouchHandler,
  SkPath,
  Group,
} from '@shopify/react-native-skia';
import {useEffect, useRef, useState} from 'react';
import * as Functions from './functions';
export interface DrawingPath {
  path: SkPath;
  tool: 'free' | 'line' | 'curve' | 'shape';
  style: 'arrow' | 'arrowDouble' | 'zigzag' | 'ticon' | 'dash' | 'normal';
  strokeWidth: number;
  color: string;
}
interface CanvasDrawingProps {
  paths: DrawingPath[];
  setPaths: React.Dispatch<React.SetStateAction<DrawingPath[]>>;
  selectedColor: string;
  selectedMode: 'draw' | 'erase' | 'move' | 'none';
  selectedTool: 'free' | 'line' | 'curve' | 'shape';
  strokeWidth: string;
  selectedStyle:
    | 'arrow'
    | 'arrowDouble'
    | 'zigzag'
    | 'ticon'
    | 'dash'
    | 'normal';
  selectedShape: 'rect' | 'circle' | 'triangle';
}
const CanvasDrawing = ({
  paths,
  setPaths,
  selectedColor,
  selectedMode,
  selectedShape,
  selectedStyle,
  selectedTool,
  strokeWidth,
}: CanvasDrawingProps) => {
  const path = useRef(Skia.Path.Make());
  const startPoint = useRef({x: 0, y: 0});
  const [drawinState, setDrawingState] = useState<'none' | 'start' | 'ended'>(
    'none',
  );
  const movingPath = useRef<DrawingPath | null>(null);
  const addPathToState = (newPath: DrawingPath) => {
    setPaths(prevPaths => [...prevPaths, newPath]);
  };
  const pathsRef = useRef(paths);
  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);
  const touchHandlerLine = useTouchHandler({
    onStart: ({x, y}) => {
      setDrawingState('start');
      startPoint.current = {x, y};
      path.current.reset();
      path.current.moveTo(x, y);
    },
    onActive: ({x, y}) => {
      path.current.reset();
      path.current.moveTo(startPoint.current.x, startPoint.current.y);
      path.current.lineTo(x, y);
    },
    onEnd: () => {
      setDrawingState('ended');
    },
  });
  const touchHandlerCurve = useTouchHandler({
    onStart: ({x, y}) => {
      setDrawingState('start');

      startPoint.current = {x, y};
      path.current.reset();
      path.current.moveTo(x, y);
    },
    onActive: ({x, y}) => {
      path.current.reset();
      path.current.moveTo(startPoint.current.x, startPoint.current.y);
      path.current.quadTo(x / 1.5, y / 1.5, x, y);
    },
    onEnd: () => {
      setDrawingState('ended');
    },
  });
  const touchHandlerFree = useTouchHandler({
    onStart: ({x, y}) => {
      setDrawingState('start');

      path.current.reset();
      path.current.moveTo(x, y);
    },
    onActive: ({x, y}) => {
      path.current.lineTo(x, y);
    },
    onEnd: () => {
      setDrawingState('ended');
    },
  });
  const touchHandlerRect = useTouchHandler({
    onStart: ({x, y}) => {
      setDrawingState('start');

      startPoint.current = {x, y};
      path.current.reset();
      path.current.moveTo(x, y);
    },
    onActive: ({x, y}) => {
      path.current.reset();
      path.current.addRect(
        Skia.XYWHRect(
          Math.min(startPoint.current.x, x),
          Math.min(startPoint.current.y, y),
          Math.abs(x - startPoint.current.x),
          Math.abs(y - startPoint.current.y),
        ),
      );
    },
    onEnd: () => {
      setDrawingState('ended');
    },
  });
  const touchHandlerCircle = useTouchHandler({
    onStart: ({x, y}) => {
      setDrawingState('start');

      startPoint.current = {x, y};
      path.current.reset();
      path.current.moveTo(x, y);
    },
    onActive: ({x, y}) => {
      path.current.reset();
      path.current.addCircle(x, y, Math.abs(x - startPoint.current.x));
    },
    onEnd: () => {
      setDrawingState('ended');
    },
  });
  const touchHandlerTriangle = useTouchHandler({
    onStart: ({x, y}) => {
      setDrawingState('start');

      startPoint.current = {x, y};
      path.current.reset();
      path.current.moveTo(x, y);
    },
    onActive: ({x, y}) => {
      path.current.reset();
      path.current.moveTo(startPoint.current.x, startPoint.current.y);
      path.current.lineTo(x, y);
      path.current.lineTo(
        startPoint.current.x + (x - startPoint.current.x) / 2,
        y,
      );
      path.current.lineTo(startPoint.current.x, startPoint.current.y);
    },
    onEnd: () => {
      setDrawingState('ended');
    },
  });

  const touchHandlerEraser = useTouchHandler({
    onStart: ({x, y}) => {
      const touchedPathIndex = pathsRef.current.findIndex(p =>
        Functions.isPointNearPath(x, y, p.path),
      );
      if (touchedPathIndex !== -1) {
        setPaths(prevPaths =>
          prevPaths.filter((_, index) => index !== touchedPathIndex),
        );
      }
    },
  });
  const touchHandlerMove = useTouchHandler({
    onStart: ({x, y}) => {
      const touchedPathIndex = pathsRef.current.findIndex(p =>
        Functions.isPointNearPath(x, y, p.path),
      );
      touchedPathIndex !== -1
        ? (movingPath.current = pathsRef.current[touchedPathIndex])
        : (movingPath.current = null);
    },
    onActive: ({x, y}) => {
      if (movingPath.current) {
        const dx = x - movingPath.current?.path.getBounds().x;
        const dy = y - movingPath.current?.path.getBounds().y;
        movingPath.current?.path.offset(dx, dy);
      }
    },
    onEnd: () => {
      setPaths(prevPaths =>
        prevPaths.map(p => {
          if (p === movingPath.current) {
            return {
              ...p,
              path: movingPath.current?.path,
            };
          } else {
            return p;
          }
        }),
      );
      movingPath.current = null;
    },
  });
  const touchHandlerNone = useTouchHandler({
    onStart: () => {},
    onActive: () => {},
    onEnd: () => {},
  });
  const touchHandlerChoose = () => {
    switch (selectedMode) {
      case 'erase':
        return touchHandlerEraser;
      case 'draw':
        switch (selectedTool) {
          case 'line':
            return touchHandlerLine;
          case 'curve':
            return touchHandlerCurve;
          case 'free':
            return touchHandlerFree;
          case 'shape':
            switch (selectedShape) {
              case 'rect':
                return touchHandlerRect;
              case 'circle':
                return touchHandlerCircle;
              case 'triangle':
                return touchHandlerTriangle;
            }
        }
      case 'move':
        return touchHandlerMove;
      case 'none':
        return touchHandlerNone;
    }
  };
  const ArrowPath = path => {
    const arrowPath = Skia.Path.Make();
    const lastPoint = path.getPoint(path.countPoints() - 1);
    const prevPoint = path.getPoint(path.countPoints() - 2);

    // Calculate arrow direction
    const dx = lastPoint.x - prevPoint.x;
    const dy = lastPoint.y - prevPoint.y;
    const angle = Math.atan2(dy, dx);

    // Arrow dimensions
    const arrowLength = 20;

    // Calculate arrow points
    const tipX = lastPoint.x;
    const tipY = lastPoint.y;
    const leftX = tipX - arrowLength * Math.cos(angle + Math.PI / 6);
    const leftY = tipY - arrowLength * Math.sin(angle + Math.PI / 6);
    const rightX = tipX - arrowLength * Math.cos(angle - Math.PI / 6);
    const rightY = tipY - arrowLength * Math.sin(angle - Math.PI / 6);

    // Draw arrow

    arrowPath.moveTo(tipX, tipY);
    arrowPath.lineTo(leftX, leftY);
    arrowPath.moveTo(tipX, tipY);
    arrowPath.lineTo(rightX, rightY);

    return arrowPath;
  };
  const generateDoubleLine = (path: SkPath, space: number) => {
    space = space * 1.5;
    const start = path.getPoint(0);
    const end = path.getLastPt();
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    const unitDx = dx / length;
    const unitDy = dy / length;

    // Get perpendicular vector
    const perpDx = -unitDy;
    const perpDy = unitDx;

    // Calculate new start and end points for the parallel line
    const newStartX = startX + perpDx * space;
    const newStartY = startY + perpDy * space;
    const newEndX = endX + perpDx * space;
    const newEndY = endY + perpDy * space;

    const doublePath = Skia.Path.Make();

    // Draw first line
    doublePath.moveTo(startX, startY);
    doublePath.lineTo(endX, endY);

    // Draw second line
    doublePath.moveTo(newStartX, newStartY);
    doublePath.lineTo(newEndX, newEndY);

    // Calculate midpoint between the ends of both lines
    const midX = (endX + newEndX) / 2;
    const midY = (endY + newEndY) / 2;

    // Calculate arrow direction (same as line direction)
    const angle = Math.atan2(dy, dx);

    // Arrow dimensions
    const arrowLength = 20;
    const arrowWidth = Math.PI / 6; // 30 degrees

    // Calculate arrow points
    // Move tip closer to line ends (adjust the 0.9 factor to fine-tune)
    const tipX = midX + unitDx * arrowLength * 0.2;
    const tipY = midY + unitDy * arrowLength * 0.2;
    const baseX = midX - unitDx * arrowLength * 1.1; // Adjusted to keep arrow length consistent
    const baseY = midY - unitDy * arrowLength * 1.1;
    const leftX = baseX + arrowLength * Math.cos(angle + arrowWidth);
    const leftY = baseY + arrowLength * Math.sin(angle + arrowWidth);
    const rightX = baseX + arrowLength * Math.cos(angle - arrowWidth);
    const rightY = baseY + arrowLength * Math.sin(angle - arrowWidth);

    // Draw arrow
    doublePath.moveTo(tipX, tipY);
    doublePath.lineTo(leftX, leftY);
    doublePath.moveTo(tipX, tipY);
    doublePath.lineTo(rightX, rightY);

    return doublePath;
  };

  const TiconPath = path => {
    const ticonPath = Skia.Path.Make();
    const lastPoint = path.getLastPt();
    const prevPoint = path.getPoint(path.countPoints() - 2);

    // Calculate direction of the main line
    const dx = lastPoint.x - prevPoint.x;
    const dy = lastPoint.y - prevPoint.y;
    const angle = Math.atan2(dy, dx);

    // Ticon dimensions
    const ticonLength = 15; // Total length of the dash

    // Calculate ticon start and end points (perpendicular to the line)
    const ticonStartX = lastPoint.x - (ticonLength / 2) * Math.sin(angle);
    const ticonStartY = lastPoint.y + (ticonLength / 2) * Math.cos(angle);
    const ticonEndX = lastPoint.x + (ticonLength / 2) * Math.sin(angle);
    const ticonEndY = lastPoint.y - (ticonLength / 2) * Math.cos(angle);

    // Draw ticon (horizontal dash centered on the last point of the line)
    ticonPath.moveTo(ticonStartX, ticonStartY);
    ticonPath.lineTo(ticonEndX, ticonEndY);
    return ticonPath;
  };
  const generateZigzagPath = (path: SkPath) => {
    const start = path.getPoint(0);
    const end = path.getLastPt();
    const zigzagSize = 5;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const numberOfZigs = Math.floor(distance / zigzagSize);
    const stepX = dx / numberOfZigs;
    const stepY = dy / numberOfZigs;

    // Calculate perpendicular vector
    const perpX = -dy / distance;
    const perpY = dx / distance;

    const zigzagPath = Skia.Path.Make();
    zigzagPath.moveTo(start.x, start.y);

    for (let i = 1; i <= numberOfZigs - 2; i++) {
      const x = start.x + i * stepX;
      const y = start.y + i * stepY;
      const midX = start.x + (i - 0.5) * stepX;
      const midY = start.y + (i - 0.5) * stepY;

      if (i % 2 === 1) {
        zigzagPath.quadTo(
          midX + perpX * zigzagSize,
          midY + perpY * zigzagSize,
          x,
          y,
        );
      } else {
        zigzagPath.quadTo(
          midX - perpX * zigzagSize,
          midY - perpY * zigzagSize,
          x,
          y,
        );
      }
    }

    // Make the last segment straight for arrow alignment
    zigzagPath.lineTo(end.x, end.y);

    // Add arrow
    const arrowPath = createArrow(zigzagPath);
    zigzagPath.addPath(arrowPath);

    return zigzagPath;
  };

  const createArrow = (path: SkPath) => {
    const arrowPath = Skia.Path.Make();
    const lastPoint = path.getLastPt();
    const prevPoint = path.getPoint(path.countPoints() - 2);

    // Calculate arrow direction
    const dx = lastPoint.x - prevPoint.x;
    const dy = lastPoint.y - prevPoint.y;
    const angle = Math.atan2(dy, dx);

    // Arrow dimensions
    const arrowLength = 20;
    const arrowWidth = Math.PI / 6;

    // Calculate arrow points
    const tipX = lastPoint.x;
    const tipY = lastPoint.y;
    const leftX = tipX - arrowLength * Math.cos(angle + arrowWidth);
    const leftY = tipY - arrowLength * Math.sin(angle + arrowWidth);
    const rightX = tipX - arrowLength * Math.cos(angle - arrowWidth);
    const rightY = tipY - arrowLength * Math.sin(angle - arrowWidth);

    // Draw arrow
    arrowPath.moveTo(tipX, tipY);
    arrowPath.lineTo(leftX, leftY);
    arrowPath.moveTo(tipX, tipY);
    arrowPath.lineTo(rightX, rightY);

    return arrowPath;
  };
  const renderPath = () => {
    if (drawinState === 'ended') {
      let rightPath = path.current.copy();
      if (selectedTool === 'curve' || selectedTool === 'line') {
        switch (selectedStyle) {
          case 'arrow':
            rightPath.addPath(ArrowPath(rightPath));
            break;
          case 'arrowDouble':
            rightPath = generateDoubleLine(rightPath, parseInt(strokeWidth));
            break;
          case 'ticon':
            rightPath.addPath(TiconPath(rightPath));
            break;
          case 'zigzag':
            rightPath = generateZigzagPath(rightPath);
            break;
          case 'dash':
            rightPath.dash(5, 5, 0);
            break;
        }
      }
      addPathToState({
        path: rightPath,
        tool: selectedTool,
        style: selectedStyle,
        strokeWidth: parseInt(strokeWidth),
        color: selectedColor,
      });
      path.current.reset();
      setDrawingState('none');
    }
    return (
      <Path
        path={path.current}
        color={selectedColor}
        style="stroke"
        strokeWidth={parseInt(strokeWidth)}
      />
    );
  };
  return (
    <Canvas
      onTouch={touchHandlerChoose()}
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
        position: 'absolute',
      }}>
      <Group>
        {paths.map((path, index) => (
          <Path
            path={path.path}
            color={path.color}
            style="stroke"
            strokeWidth={path.strokeWidth}
          />
        ))}

        {selectedMode === 'draw' && renderPath()}
      </Group>
    </Canvas>
  );
};
export default CanvasDrawing;
