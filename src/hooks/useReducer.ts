import { useState, useEffect, useCallback, useRef } from "react";

export type Dispatch<E> = (event: E) => void;
export type Reducer<S, E> = (state: S, event: E) => [S, Command<E>];
export interface Command<E> {
  seq: number;
  execute: (dispatch: Dispatch<E>) => void;
}

const useReducer = <S, E>(
  reducer: Reducer<S, E>,
  initialState: S,
  initialCommand: Command<E>
): [S, Dispatch<E>] => {
  const [state, setState] = useState<S>(initialState);
  const initialCommandIssued = useRef(false);
  const lastIssuedCommandSeq = useRef(-1);

  const dispatch = useCallback(
    (event: E) => {
      setState((state) => {
        const [newState, command] = reducer(state, event);

        // Prevents command duplication when react calls setState twice
        if (command.seq > lastIssuedCommandSeq.current) {
          setTimeout(() => command.execute(dispatch), 0);
          lastIssuedCommandSeq.current = command.seq;
        }

        return newState;
      });
    },
    [reducer]
  );

  useEffect(() => {
    // Prevents command duplication when react calls setState twice
    if (!initialCommandIssued.current) {
      setTimeout(() => {
        initialCommand.execute(dispatch);
      }, 0);
      initialCommandIssued.current = true;
    }
  }, [initialCommand, dispatch]);

  return [state, dispatch];
};

export default useReducer;
