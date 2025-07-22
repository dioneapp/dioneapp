import { useCallback, useEffect, useRef, useState } from "react";

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

export const useCustomDrag = ({
	apps,
	setApps,
	maxApps,
}: UseCustomDragProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const startPositionRef = useRef<{ x: number; y: number } | null>(null);
	const STORAGE_KEY = "quicklaunch-app-positions";
	const DRAG_DELAY = 200;

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
			console.error("Error loading saved positions:", error);
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
			console.error("Error saving positions:", error);
		}
	}, []);

	const applyStoredPositions = useCallback(
		(appsToOrder: any[]) => {
			const savedPositions = loadSavedPositions();
			if (savedPositions.length === 0) return appsToOrder;

			const orderedApps = new Array(maxApps).fill(null);
			const validApps = appsToOrder.filter((app) => app && app.id);
			const appMap = new Map(validApps.map((app) => [app.id, app]));

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
		},
		[maxApps, loadSavedPositions],
	);

	const getSlotAtPosition = useCallback(
		(x: number, y: number): number | null => {
			if (!containerRef.current) return null;

			const slots = containerRef.current.querySelectorAll("[data-slot-index]");
			for (let i = 0; i < slots.length; i++) {
				const slot = slots[i] as HTMLElement;
				const rect = slot.getBoundingClientRect();
				if (
					x >= rect.left &&
					x <= rect.right &&
					y >= rect.top &&
					y <= rect.bottom
				) {
					return Number.parseInt(slot.dataset.slotIndex || "0");
				}
			}
			return null;
		},
		[],
	);

	const clearDragTimeout = useCallback(() => {
		if (dragTimeoutRef.current) {
			clearTimeout(dragTimeoutRef.current);
			dragTimeoutRef.current = null;
		}
	}, []);

	const startDrag = useCallback(
		(
			clientX: number,
			clientY: number,
			app: any,
			index: number,
			targetElement: HTMLElement,
		) => {
			const rect = targetElement.getBoundingClientRect();
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

			document.body.style.cursor = "grabbing";
			document.body.style.userSelect = "none";
		},
		[],
	);

	const handlePointerDown = useCallback(
		(e: React.MouseEvent | React.TouchEvent, app: any, index: number) => {
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const target = e.currentTarget as HTMLElement;

			startPositionRef.current = { x: clientX, y: clientY };

			clearDragTimeout();

			dragTimeoutRef.current = setTimeout(() => {
				startDrag(clientX, clientY, app, index, target);
			}, DRAG_DELAY);
		},
		[startDrag, clearDragTimeout],
	);

	const handlePointerUp = useCallback(
		(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
			if (dragState.isDragging) {
				const clientX =
					"touches" in e
						? "changedTouches" in e
							? e.changedTouches[0].clientX
							: (e as TouchEvent).changedTouches[0].clientX
						: e.clientX;
				const clientY =
					"touches" in e
						? "changedTouches" in e
							? e.changedTouches[0].clientY
							: (e as TouchEvent).changedTouches[0].clientY
						: e.clientY;

				const targetSlot = getSlotAtPosition(clientX, clientY);

				if (
					targetSlot !== null &&
					dragState.draggedFromIndex !== null &&
					targetSlot !== dragState.draggedFromIndex
				) {
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

				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			}

			clearDragTimeout();
			startPositionRef.current = null;
		},
		[
			dragState,
			getSlotAtPosition,
			apps,
			setApps,
			savePositions,
			clearDragTimeout,
		],
	);

	const handlePointerMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!dragState.isDragging) {
				if (dragTimeoutRef.current && startPositionRef.current) {
					const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
					const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

					const deltaX = Math.abs(clientX - startPositionRef.current.x);
					const deltaY = Math.abs(clientY - startPositionRef.current.y);

					if (deltaX > 10 || deltaY > 10) {
						clearDragTimeout();
						startPositionRef.current = null;
					}
				}
				return;
			}

			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const hoveredSlot = getSlotAtPosition(clientX, clientY);

			setDragState((prev) => ({
				...prev,
				mousePosition: { x: clientX, y: clientY },
				hoveredSlot,
			}));
		},
		[dragState.isDragging, getSlotAtPosition, clearDragTimeout],
	);

	useEffect(() => {
		document.addEventListener("mousemove", handlePointerMove);
		document.addEventListener("mouseup", handlePointerUp);
		document.addEventListener("touchmove", handlePointerMove, {
			passive: false,
		});
		document.addEventListener("touchend", handlePointerUp);

		return () => {
			document.removeEventListener("mousemove", handlePointerMove);
			document.removeEventListener("mouseup", handlePointerUp);
			document.removeEventListener("touchmove", handlePointerMove);
			document.removeEventListener("touchend", handlePointerUp);
		};
	}, [handlePointerMove, handlePointerUp]);

	useEffect(() => {
		return () => {
			clearDragTimeout();
		};
	}, [clearDragTimeout]);

	return {
		dragState,
		containerRef,
		handlePointerDown,
		applyStoredPositions,
		savePositions,
	};
};
