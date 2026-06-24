import { IonContent, IonPage } from '@ionic/react';
import './HomePage.css';
import { AppState, EmptyAppConfig, InAppState } from '../model';
import { Dispatch } from '../hooks/useReducer';
import { AppEvent } from '../events';
import ProgressIndicator from '../components/ProgressIndicator';
import FolderView from '../components/FolderView';
import { useParams } from 'react-router';
import { getFolder } from '../business';
import ConfigView from '../components/ConfigView';

interface HomePageProps {
  state: AppState;
  dispatch: Dispatch<AppEvent>;
}

// TODO: show (state.folderMeta.errors) somehow
const HomePage: React.FC<HomePageProps> = (props) => {
  const state = props.state;
  const dispatch = props.dispatch;

  const params = useParams() as { [key: string]: string };

  const getView = () => {
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

    // TODO: so this could actually be done in business
    // but then,
    // ether we give up on pages, but that means losing scroll position
    // or we open new page with stale model, and for a while show irrelevant view
    const path = params.path;
    const folder = getFolder(path, state.inAppState.fileTree);
    // TODO: better component
    if (!folder) {
      return <div>404 Not found</div>
    }

    return <FolderView
      pendingDownload={state.inAppState.pendingDownload}
      folder={folder}
      dispatch={dispatch} />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {getView()}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
