import { CommandType, HistoryGoBackCommand, HistoryGoForwardCommand, HistoryPushStateCommand, HistoryReplaceStateCommand } from "../commands";
import { EventType } from "../events";

export const HistoryPushState = (seq: number, path: string): HistoryPushStateCommand => ({
    seq,
    path,
    type: CommandType.HistoryPushState,
    execute: async (dispatch) => {
        window.history.pushState(null, "", path);
        dispatch({
            type: EventType.LocationUpdated,
            path,
        });
    },
});

export const HistoryReplaceState = (seq: number, path: string): HistoryReplaceStateCommand => ({
    seq,
    path,
    type: CommandType.HistoryReplaceState,
    execute: async () => {
        window.history.replaceState(null, "", path);
        // TODO: dispatch LocationUpdated?
    },
});

export const HistoryGoForward = (seq: number): HistoryGoForwardCommand => ({
    seq,
    type: CommandType.HistoryGoForward,
    execute: async () => {
        window.history.forward();
    },
});

export const HistoryGoBack = (seq: number): HistoryGoBackCommand => ({
    seq,
    type: CommandType.HistoryGoBack,
    execute: async () => {
        window.history.back();
    },
});