import { useState, useRef, useCallback, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  draggedApp: any;
  draggedFromIndex: number | null;
  mousePosition: { x: number; y: number };
  dragOffset: { x: number; y: number };
  hoveredSlot: number | null;
}

interface UseCustomDragProps {
  apps: any[];
  setApps: (apps: any[]) => void;
  maxApps: number;
}

interface AppSlotPosition {
  id: string;
  slotIndex: number;
}

export const useCustomDrag = ({ apps, setApps, maxApps }: UseCustomDragProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const STORAGE_KEY = 'quicklaunch-app-positions';
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedApp: null,
    draggedFromIndex: null,
    mousePosition: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    hoveredSlot: null,
  });

  const loadSavedPositions = useCallback((): AppSlotPosition[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved positions:', error);
      return [];
    }
  }, []);

  const savePositions = useCallback((newApps: any[]) => {
    try {
      const positions: AppSlotPosition[] = newApps
        .map((app, index) => {
          if (app && app.id) {
            return { id: app.id, slotIndex: index };
          }
          return null;
        })
        .filter((position): position is AppSlotPosition => position !== null);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch (error) {
      console.error('Error saving positions:', error);
    }
  }, []);

  const applyStoredPositions = useCallback((appsToOrder: any[]) => {
    const savedPositions = loadSavedPositions();
    if (savedPositions.length === 0) return appsToOrder;

    const orderedApps = new Array(maxApps).fill(null);
    const validApps = appsToOrder.filter(app => app && app.id);
    const appMap = new Map(validApps.map(app => [app.id, app]));
    savedPositions.forEach(({ id, slotIndex }) => {
      const app = appMap.get(id);
      if (app && slotIndex >= 0 && slotIndex < maxApps) {
        orderedApps[slotIndex] = app;
        appMap.delete(id);
      }
    });
    let nextEmptySlot = 0;
    for (const app of appMap.values()) {
      while (nextEmptySlot < maxApps && orderedApps[nextEmptySlot] !== null) {
        nextEmptySlot++;
      }
      if (nextEmptySlot < maxApps) {
        orderedApps[nextEmptySlot] = app;
        nextEmptySlot++;
      }
    }
    return orderedApps;
  }, [maxApps, loadSavedPositions]);

  const getSlotAtPosition = useCallback((x: number, y: number): number | null => {
    if (!containerRef.current) return null;
    const slots = containerRef.current.querySelectorAll('[data-slot-index]');
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i] as HTMLElement;
      const rect = slot.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return parseInt(slot.dataset.slotIndex || '0');
      }
    }
    return null;
  }, []);

  const handleDragStart = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    app: any,
    index: number
  ) => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
    setDragState({
      isDragging: true,
      draggedApp: app,
      draggedFromIndex: index,
      mousePosition: { x: clientX, y: clientY },
      dragOffset: offset,
      hoveredSlot: null,
    });
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const hoveredSlot = getSlotAtPosition(clientX, clientY);
    setDragState(prev => ({
      ...prev,
      mousePosition: { x: clientX, y: clientY },
      hoveredSlot,
    }));
  }, [dragState.isDragging, getSlotAtPosition]);

  const handleMouseUp = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging || dragState.draggedFromIndex === null) return;
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
    const targetSlot = getSlotAtPosition(clientX, clientY);
    if (targetSlot !== null && targetSlot !== dragState.draggedFromIndex) {
      const newApps = [...apps];
      if (newApps[targetSlot]) {
        const tempApp = newApps[targetSlot];
        newApps[targetSlot] = dragState.draggedApp;
        newApps[dragState.draggedFromIndex] = tempApp;
      } else {
        newApps[targetSlot] = dragState.draggedApp;
        newApps[dragState.draggedFromIndex] = null;
      }
      setApps(newApps);
      savePositions(newApps);
    }
    setDragState({
      isDragging: false,
      draggedApp: null,
      draggedFromIndex: null,
      mousePosition: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 },
      hoveredSlot: null,
    });
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [dragState, getSlotAtPosition, apps, setApps, savePositions]);

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    dragState,
    containerRef,
    handleDragStart,
    applyStoredPositions,
    savePositions,
  };
};
