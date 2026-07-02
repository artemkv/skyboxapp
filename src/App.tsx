import { IonApp, setupIonicReact } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import HomePage from './pages/HomePage';
import { AppState } from './model';
import { Dispatch } from './hooks/useReducer';
import { AppEvent, EventType } from './events';
import { useEffect } from 'react';
import type { BackButtonEvent, BackButtonEventDetail } from '@ionic/core';

setupIonicReact();

interface AppProps {
  state: AppState;
  dispatch: Dispatch<AppEvent>;
}

const App: React.FC<AppProps> = (props) => {
  const state = props.state;
  const dispatch = props.dispatch;

  useEffect(() => {
    const handler = () => {
      // TODO: pass all the parts of URL?
      dispatch({ type: EventType.LocationUpdated, url: location.pathname });
    };

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [dispatch]);

  useEffect(() => {
    const handler = (event: Event) => {
      const backButtonEvent = event as CustomEvent<BackButtonEventDetail>;
      // TODO: right priority
      backButtonEvent.detail.register(0, () => {
        dispatch({ type: EventType.GoBackRequested });
      });
    };

    document.addEventListener('ionBackButton', handler);
    return () => document.removeEventListener('ionBackButton', handler);
  }, [dispatch]);

  // TODO: move all route constants to a single place
  return (
    <IonApp>
      <HomePage state={state} dispatch={dispatch} />
    </IonApp>
  );
}

export default App;
