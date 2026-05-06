"use client";

import { useRef, useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import { mergeSlotProps } from "@mui/material/utils";
import Drawer, { type DrawerProps } from "@mui/material/Drawer";

type ResizableDrawerProps = DrawerProps & {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  resizeHandleSize?: number;
};

const DEFAULT_SIZE = 400;
const DEFAULT_MIN_SIZE = 320;
const DEFAULT_HANDLE_SIZE = 5;

const horizontalAnchors = new Set<DrawerProps["anchor"]>(["left", "right", undefined]);

export const ResizableDrawer = ({
  anchor = "left",
  children,
  defaultSize = DEFAULT_SIZE,
  minSize = DEFAULT_MIN_SIZE,
  maxSize = Number.POSITIVE_INFINITY,
  resizeHandleSize = DEFAULT_HANDLE_SIZE,
  slotProps,
  ...drawerProps
}: ResizableDrawerProps) => {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const sizeRef = useRef(size);
  const cleanupRef = useRef<(() => void) | null>(null);

  const isHorizontal = horizontalAnchors.has(anchor);
  const cursor = isHorizontal ? "col-resize" : "row-resize";

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  const clampSize = useCallback(
    (nextSize: number) => Math.min(Math.max(nextSize, minSize), maxSize),
    [maxSize, minSize],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      cleanupRef.current?.();

      const startPointerPosition = isHorizontal ? event.clientX : event.clientY;
      const startSize = sizeRef.current;
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.cursor = cursor;
      document.body.style.userSelect = "none";
      setIsResizing(true);

      const handlePointerMove = (pointerEvent: PointerEvent) => {
        pointerEvent.preventDefault();

        const pointerPosition = isHorizontal ? pointerEvent.clientX : pointerEvent.clientY;
        const delta = (() => {
          if (anchor === "right") {
            return startPointerPosition - pointerPosition;
          }

          if (anchor === "bottom") {
            return startPointerPosition - pointerPosition;
          }

          return pointerPosition - startPointerPosition;
        })();

        setSize(clampSize(startSize + delta));
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        cleanupRef.current = null;
        setIsResizing(false);
      };

      const handlePointerUp = () => {
        cleanup();
      };

      cleanupRef.current = cleanup;
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [anchor, clampSize, cursor, isHorizontal],
  );

  const paperSx = {
    flexShrink: 0,
    ...(isHorizontal ? { width: size } : { height: size }),
    maxWidth: "100vw",
    maxHeight: "100vh",
  };

  const handleSx = {
    position: "absolute",
    zIndex: 1,
    cursor,
    touchAction: "none",
    borderRadius: "5px",
    ...(isHorizontal
      ? {
          top: "48%",
          bottom: "48%",
          width: resizeHandleSize,
          ...(anchor === "right" ? { left: resizeHandleSize } : { right: 0 }),
        }
      : {
          left: 0,
          right: 0,
          height: resizeHandleSize,
          ...(anchor === "bottom" ? { top: 0 } : { bottom: 0 }),
        }),
  };

  return (
    <Drawer
      anchor={anchor}
      variant="temporary"
      slotProps={{
        ...slotProps,
        paper: mergeSlotProps({ sx: paperSx, elevation: 11 }, slotProps?.paper),
      }}
      {...drawerProps}
    >
      {children}
      <Box
        aria-hidden
        onPointerDown={handlePointerDown}
        sx={(theme) => ({
          ...handleSx,
          ...(isHorizontal && Number.isFinite(maxSize)
            ? {
                [`@media (max-width: ${maxSize}px)`]: {
                  display: "none",
                },
              }
            : null),

          backgroundColor: theme.palette.grey[isResizing ? 500 : 300],
        })}
      />
    </Drawer>
  );
};
