import { useEffect } from "react";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "./useReducer";
import type { BackButtonEventDetail } from '@ionic/core';

const NAVIGATION_EVENT_PRIORITY = 0;

const useHandleBackButton = (dispatch: Dispatch<AppEvent>) => {
    useEffect(() => {
        const handler = (event: Event) => {
            const backButtonEvent = event as CustomEvent<BackButtonEventDetail>;
            backButtonEvent.detail.register(NAVIGATION_EVENT_PRIORITY, () => {
                dispatch({ type: EventType.BackButtonClicked });
            });
        };

        document.addEventListener('ionBackButton', handler);
        return () => document.removeEventListener('ionBackButton', handler);
    }, [dispatch]);
}

export default useHandleBackButton;
