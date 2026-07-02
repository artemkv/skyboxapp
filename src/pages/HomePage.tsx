import './HomePage.css';
import { AppState, EmptyAppConfig, InAppState } from '../model';
import { Dispatch } from '../hooks/useReducer';
import { AppEvent } from '../events';
import ProgressIndicator from '../components/ProgressIndicator';
import FolderView from '../components/FolderView';
import ConfigView from '../components/ConfigView';

interface HomePageProps {
  state: AppState;
  dispatch: Dispatch<AppEvent>;
}

// TODO: show (state.folderMeta.errors) somehow
const HomePage: React.FC<HomePageProps> = (props) => {
  const state = props.state;
  const dispatch = props.dispatch;

  if (state.inAppState.state == InAppState.AppConfigLoading ||
    state.inAppState.state == InAppState.FolderMetaLoading ||
    state.inAppState.state == InAppState.AppConfigSaving
  ) {
    return <ProgressIndicator />
  }

  if (state.inAppState.state == InAppState.AppConfigLoadingFailed ||
    state.inAppState.state == InAppState.AppConfigSavingFailed
  ) {
    return <ConfigView appConfig={EmptyAppConfig} dispatch={dispatch} />
  }

  // TODO: better error view
  if (state.inAppState.state == InAppState.FolderMetaLoadingFailed
  ) {
    return <div>ERROR: {state.inAppState.err}</div>
  }

  // TODO: test
  if (!state.inAppState.currentFolder) {
    return <div>404 Not found</div>
  }

  return <FolderView
    pendingDownload={state.inAppState.pendingDownload}
    folder={state.inAppState.currentFolder}
    dispatch={dispatch} />;
};

export default HomePage;
