import { handleAppConfigLoaded, handleAppConfigLoadingFailed, handleAppConfigSaved, handleAppConfigSavingFailed, handleAppConfigSubmitted, handleBackButtonClicked, handleFileDownloaded, handleFileDownloadFailed, handleFileDownloadRequested, handleFolderMetaLoaded, handleFolderMetaLoadingFailed, handleLocationUpdatedEvent, handleNavigationRequested, handleOpeningFileFailed } from "./business";
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

    if (event.type == EventType.NavigationRequested) {
        return handleNavigationRequested(state, event);
    }
    if (event.type == EventType.BackButtonClicked) {
        return handleBackButtonClicked(state);
    }
    if (event.type == EventType.LocationUpdated) {
        return handleLocationUpdatedEvent(state, event);
    }

    if (event.type == EventType.AppConfigLoaded) {
        return handleAppConfigLoaded(state, event);
    }
    if (event.type == EventType.AppConfigLoadingFailed) {
        return handleAppConfigLoadingFailed(state, event);
    }

    if (event.type == EventType.AppConfigSubmitted) {
        return handleAppConfigSubmitted(state, event);
    }
    if (event.type == EventType.AppConfigSaved) {
        return handleAppConfigSaved(state);
    }
    if (event.type == EventType.AppConfigSavingFailed) {
        return handleAppConfigSavingFailed(state, event);
    }

    if (event.type == EventType.FolderMetaLoaded) {
        return handleFolderMetaLoaded(state, event);
    }
    if (event.type == EventType.FolderMetaLoadingFailed) {
        return handleFolderMetaLoadingFailed(state, event);
    }

    if (event.type == EventType.FileDownloadRequested) {
        return handleFileDownloadRequested(state, event);
    }
    if (event.type == EventType.FileDownloaded) {
        return handleFileDownloaded(state, event);
    }
    if (event.type == EventType.FileDownloadFailed) {
        return handleFileDownloadFailed(state, event);
    }

    if (event.type == EventType.OpeningFileFailed) {
        return handleOpeningFileFailed(state, event);
    }

    console.error(
        `Unknown event ${EventType[event.type]} '${JSON.stringify(event)}'`
    );

    return JustState(state);
};
