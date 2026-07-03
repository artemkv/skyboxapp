import './HomePage.css';
import { EmptyAppConfig, InAppState, InAppStateCurrent, ViewType } from '../model';
import { Dispatch } from '../hooks/useReducer';
import { AppEvent } from '../events';
import ProgressIndicator from '../components/ProgressIndicator';
import FolderView from '../components/FolderView';
import ConfigView from '../components/ConfigView';
import TextPreview from '../components/TextPreview';

interface HomePageProps {
  inAppState: InAppStateCurrent;
  dispatch: Dispatch<AppEvent>;
}

// TODO: show (state.folderMeta.errors) somehow
const HomePage: React.FC<HomePageProps> = (props) => {
  const inAppState = props.inAppState;
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

  if (inAppState.view.type == ViewType.FilePreview) {
    if (inAppState.view.content) {
      return <TextPreview content={inAppState.view.content} dispatch={dispatch} />
    }
  }

  const folder = inAppState.view.folder;
  if (!folder) {
    return <div>404 Not found</div>
  }

  let showProgress = false;
  if (inAppState.view.type == ViewType.FolderView && inAppState.view.pendingProgress) {
    showProgress = true;
  }
  if (inAppState.view.type == ViewType.FilePreview && !inAppState.view.content) {
    showProgress = true;
  }

  // TODO: rename pendingDownload
  return <FolderView
    pendingDownload={showProgress}
    folder={folder}
    dispatch={dispatch} />;
};

export default HomePage;
