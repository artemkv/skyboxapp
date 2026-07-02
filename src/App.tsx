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
import { AppEvent } from './events';
import useHandleBackButton from './hooks/useHandleBackButton';
import useHandleLocationUpdate from './hooks/useHandleLocationUpdate';

setupIonicReact();

interface AppProps {
  state: AppState;
  dispatch: Dispatch<AppEvent>;
}

const App: React.FC<AppProps> = (props) => {
  const state = props.state;
  const dispatch = props.dispatch;

  useHandleBackButton(dispatch);
  useHandleLocationUpdate(dispatch);

  return (
    <IonApp>
      <HomePage state={state} dispatch={dispatch} />
    </IonApp>
  );
}

export default App;
