import { handleFileDownloadRequested, handleFolderMetaLoaded, handleFolderMetaLoadingFailed } from "./business";
import { AppCommand, DoNothing } from "./commands";
import { AppEvent, EventType } from "./events";
import { AppState } from "./model";

export const JustState = (state: AppState): [AppState, AppCommand] => [
    state,
    DoNothing,
];

export const Reducer = (
    state: AppState,
    event: AppEvent
): [AppState, AppCommand] => {
    // Uncomment when debugging
    /*console.log(
        `Reducing event '${EventType[event.type]} ${JSON.stringify(event)}'`
    );*/

    if (event.type == EventType.FolderMetaLoaded) {
        return handleFolderMetaLoaded(state, event);
    }

    if (event.type == EventType.FolderMetaLoadingFailed) {
        return handleFolderMetaLoadingFailed(state, event);
    }

    if (event.type == EventType.FileDownloadRequested) {
        return handleFileDownloadRequested(state, event);
    }

    console.error(
        `Unknown event ${EventType[event.type]} '${JSON.stringify(event)}'`
    );

    return JustState(state);
};
