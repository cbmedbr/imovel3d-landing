import { useState, useCallback, useRef } from "react";

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const push = useCallback((newState: T) => {
    pastRef.current = [...pastRef.current, state];
    futureRef.current = [];
    setState(newState);
  }, [state]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [state, ...futureRef.current];
    setState(prev);
  }, [state]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[0];
    futureRef.current = futureRef.current.slice(1);
    pastRef.current = [...pastRef.current, state];
    setState(next);
  }, [state]);

  return {
    state,
    set: push,
    setDirect: setState, // without history (for dragging)
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
  };
}
