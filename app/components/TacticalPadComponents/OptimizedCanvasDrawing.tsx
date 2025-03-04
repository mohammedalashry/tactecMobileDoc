// components/TacticalPadComponents/OptimizedCanvasDrawing.tsx
import {
  Path,
  Canvas,
  Skia,
  useTouchHandler,
  SkPath,
  Group,
  useCanvasRef,
  runOnJS,
} from '@shopify/react-native-skia';
import {useEffect, useRef, useState, memo} from 'react';
import {isPointNearPath} from './utils/pathUtils';
import type {DrawingPath} from '../../hooks/tacticalPad/useTacticalPadState';

// Utility functions
const createArrow = (path: SkPath): SkPath => {
  const arrowPath = Skia.Path.Make();
  if (path.countPoints() < 2) return arrowPath;

  const lastPoint = path.getLastPt();
  const prevPoint = path.getPoint(path.countPoints() - 2);

  // Calculate arrow direction
  const dx = lastPoint.x - prevPoint.x;
  const dy = lastPoint.y - prevPoint.y;
  const angle = Math.atan2(dy, dx);

  // Arrow dimensions
  const arrowLength = 20;
  const arrowWidth = Math.PI / 6; // 30 degrees

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

const generateDoubleLine = (path: SkPath, strokeWidth: number): SkPath => {
  const space = strokeWidth * 1.5;
  if (path.countPoints() < 2) return Skia.Path.Make();

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
  const tipX = midX + unitDx * arrowLength * 0.2;
  const tipY = midY + unitDy * arrowLength * 0.2;
  const baseX = midX - unitDx * arrowLength * 1.1;
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

const createTiconPath = (path: SkPath): SkPath => {
  const ticonPath = Skia.Path.Make();
  if (path.countPoints() < 2) return ticonPath;

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

const generateZigzagPath = (path: SkPath): SkPath => {
  if (path.countPoints() < 2) return Skia.Path.Make();

  const start = path.getPoint(0);
  const end = path.getLastPt();
  const zigzagSize = 5;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const numberOfZigs = Math.floor(distance / zigzagSize);

  if (numberOfZigs <= 2) return path;

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

export interface CanvasDrawingProps {
  paths: DrawingPath[];
  setPaths: (paths: DrawingPath[]) => void;
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

const OptimizedCanvasDrawing = ({
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
  const canvasRef = useCanvasRef();

  // Use refs to avoid recreating touch handlers on each render
  const pathsRef = useRef(paths);
  const selectedModeRef = useRef(selectedMode);
  const selectedToolRef = useRef(selectedTool);
  const selectedStyleRef = useRef(selectedStyle);
  const selectedShapeRef = useRef(selectedShape);
  const selectedColorRef = useRef(selectedColor);
  const strokeWidthRef = useRef(strokeWidth);

  // Update refs when props change
  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);

  useEffect(() => {
    selectedModeRef.current = selectedMode;
  }, [selectedMode]);

  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    selectedStyleRef.current = selectedStyle;
  }, [selectedStyle]);

  useEffect(() => {
    selectedShapeRef.current = selectedShape;
  }, [selectedShape]);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  const addPathToState = (newPath: DrawingPath) => {
    setPaths([...pathsRef.current, newPath]);
  };

  // Optimize by defining handlers once
  const handleDrawingEnd = () => {
    if (selectedModeRef.current !== 'draw') return;

    let finalPath = path.current.copy();

    if (
      selectedToolRef.current === 'curve' ||
      selectedToolRef.current === 'line'
    ) {
      switch (selectedStyleRef.current) {
        case 'arrow':
          finalPath.addPath(createArrow(finalPath));
          break;
        case 'arrowDouble':
          finalPath = generateDoubleLine(
            finalPath,
            parseInt(strokeWidthRef.current),
          );
          break;
        case 'ticon':
          finalPath.addPath(createTiconPath(finalPath));
          break;
        case 'zigzag':
          finalPath = generateZigzagPath(finalPath);
          break;
        case 'dash':
          finalPath.dash(5, 5, 0);
          break;
      }
    }

    addPathToState({
      path: finalPath,
      tool: selectedToolRef.current,
      style: selectedStyleRef.current,
      strokeWidth: parseInt(strokeWidthRef.current),
      color: selectedColorRef.current,
    });

    path.current.reset();
    setDrawingState('none');
  };

  // Pre-defined event handlers with worklets for better performance
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
      runOnJS(setDrawingState)('ended');
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
      runOnJS(setDrawingState)('ended');
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
      runOnJS(setDrawingState)('ended');
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
      runOnJS(setDrawingState)('ended');
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
      const radius = Math.abs(x - startPoint.current.x);
      path.current.reset();
      path.current.addCircle(
        startPoint.current.x,
        startPoint.current.y,
        radius,
      );
    },
    onEnd: () => {
      runOnJS(setDrawingState)('ended');
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
      runOnJS(setDrawingState)('ended');
    },
  });

  const touchHandlerEraser = useTouchHandler({
    onStart: ({x, y}) => {
      const touchedPathIndex = pathsRef.current.findIndex(p =>
        isPointNearPath(x, y, p.path),
      );
      if (touchedPathIndex !== -1) {
        setPaths(
          pathsRef.current.filter((_, index) => index !== touchedPathIndex),
        );
      }
    },
  });

  const touchHandlerMove = useTouchHandler({
    onStart: ({x, y}) => {
      const touchedPathIndex = pathsRef.current.findIndex(p =>
        isPointNearPath(x, y, p.path),
      );
      touchedPathIndex !== -1
        ? (movingPath.current = pathsRef.current[touchedPathIndex])
        : (movingPath.current = null);
    },
    onActive: ({x, y}) => {
      if (movingPath.current) {
        const bounds = movingPath.current.path.getBounds();
        const dx = x - bounds.x;
        const dy = y - bounds.y;
        movingPath.current.path.offset(dx, dy);
      }
    },
    onEnd: () => {
      if (movingPath.current) {
        setPaths(
          pathsRef.current.map(p => {
            if (p === movingPath.current) {
              return {
                ...p,
                path: movingPath.current.path,
              };
            } else {
              return p;
            }
          }),
        );
        movingPath.current = null;
      }
    },
  });

  const touchHandlerNone = useTouchHandler({
    onStart: () => {},
    onActive: () => {},
    onEnd: () => {},
  });

  // Determine which touch handler to use based on current mode and tool
  const getTouchHandler = () => {
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
              default:
                return touchHandlerNone;
            }
          default:
            return touchHandlerNone;
        }
      case 'move':
        return touchHandlerMove;
      case 'none':
      default:
        return touchHandlerNone;
    }
  };

  // Process drawing state changes
  useEffect(() => {
    if (drawinState === 'ended') {
      handleDrawingEnd();
    }
  }, [drawinState]);

  return (
    <Canvas
      ref={canvasRef}
      onTouch={getTouchHandler()}
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
        position: 'absolute',
      }}>
      <Group>
        {/* Render existing paths */}
        {paths.map((p, index) => (
          <Path
            key={index}
            path={p.path}
            color={p.color}
            style="stroke"
            strokeWidth={p.strokeWidth}
          />
        ))}

        {/* Render current drawing path */}
        {selectedMode === 'draw' && (
          <Path
            path={path.current}
            color={selectedColor}
            style="stroke"
            strokeWidth={parseInt(strokeWidth)}
          />
        )}
      </Group>
    </Canvas>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(OptimizedCanvasDrawing);
