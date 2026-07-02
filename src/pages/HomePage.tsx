import './HomePage.css';
import { EmptyAppConfig, InAppState, InAppStateCurrent } from '../model';
import { Dispatch } from '../hooks/useReducer';
import { AppEvent } from '../events';
import ProgressIndicator from '../components/ProgressIndicator';
import FolderView from '../components/FolderView';
import ConfigView from '../components/ConfigView';
import { getFolder } from '../business';

interface HomePageProps {
  inAppState: InAppStateCurrent;
  folderPath: string;
  dispatch: Dispatch<AppEvent>;
}

// TODO: show (state.folderMeta.errors) somehow
const HomePage: React.FC<HomePageProps> = (props) => {
  const inAppState = props.inAppState;
  const folderPath = props.folderPath;
  const dispatch = props.dispatch;

  if (inAppState.state == InAppState.AppConfigLoading ||
    inAppState.state == InAppState.FolderMetaLoading ||
    inAppState.state == InAppState.AppConfigSaving
  ) {
    return <ProgressIndicator />
  }

  if (inAppState.state == InAppState.AppConfigLoadingFailed ||
    inAppState.state == InAppState.AppConfigSavingFailed
  ) {
    return <ConfigView appConfig={EmptyAppConfig} dispatch={dispatch} />
  }

  // TODO: better error view
  if (inAppState.state == InAppState.FolderMetaLoadingFailed
  ) {
    return <div>ERROR: {inAppState.err}</div>
  }

  const folder = getFolder(folderPath, inAppState.fileTree);
  if (!folder) {
    return <div>404 Not found</div>
  }

  return <FolderView
    pendingDownload={inAppState.pendingDownload}
    folder={folder}
    dispatch={dispatch} />;
};

export default HomePage;
