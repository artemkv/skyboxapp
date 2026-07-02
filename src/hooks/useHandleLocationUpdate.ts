import { useEffect } from "react";
import { Dispatch } from "./useReducer";
import { AppEvent, EventType } from "../events";

// TODO: detect navigation direction
/*
The usual solution: track an index in history.state

When you push a new entry, include a monotonically increasing index:

history.replaceState({ index: 0 }, "");

let currentIndex = 0;

function navigate(url: string) {
  currentIndex++;
  history.pushState({ index: currentIndex }, "", url);
}

Then:

window.addEventListener("popstate", (event) => {
  const newIndex = event.state?.index;

  if (newIndex < currentIndex) {
    console.log("Back");
  } else if (newIndex > currentIndex) {
    console.log("Forward");
  }

  currentIndex = newIndex;
});
*/

const useHandleLocationUpdate = (dispatch: Dispatch<AppEvent>) => {
  useEffect(() => {
    const handler = () => {
      dispatch({ type: EventType.LocationUpdated, path: location.pathname });
    };

    window.addEventListener('popstate', handler);

    dispatch({ type: EventType.LocationUpdated, path: location.pathname });

    return () => window.removeEventListener('popstate', handler);
  }, [dispatch]);
}

export default useHandleLocationUpdate;
