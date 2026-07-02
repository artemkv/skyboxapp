import { CommandType, HistoryGoBackCommand, HistoryGoForwardCommand, HistoryPushStateCommand, HistoryReplaceStateCommand } from "../commands";
import { EventType } from "../events";

export const HistoryPushState = (seq: number, url: string): HistoryPushStateCommand => ({
    seq,
    url,
    type: CommandType.HistoryPushState,
    execute: async (dispatch) => {
        window.history.pushState(null, "", url);
        dispatch({
            type: EventType.LocationUpdated,
            // TODO: Can I get Location from here, and work on that level?
            url,
        });
    },
});

export const HistoryReplaceState = (seq: number, url: string): HistoryReplaceStateCommand => ({
    seq,
    url,
    type: CommandType.HistoryReplaceState,
    execute: async () => {
        window.history.replaceState(null, "", url);
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