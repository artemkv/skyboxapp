import { IonContent, IonPage } from '@ionic/react';
import './HomePage.css';
import { AppState, FolderMetaState } from '../model';
import { Dispatch } from '../hooks/useReducer';
import { AppEvent } from '../events';
import ProgressIndicator from '../components/ProgressIndicator';
import FolderView from '../components/FolderView';
import { useParams } from 'react-router';
import { getFolder } from '../business';

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
    if (state.folderMeta.state == FolderMetaState.Loading) {
      return <ProgressIndicator />
    }
    if (state.folderMeta.state == FolderMetaState.LoadingFailed) {
      return <div>ERROR: {state.folderMeta.err}</div>
    }

    const path = params.path;
    const folder = getFolder(path, state.folderMeta);
    // TODO: better component
    if (!folder) {
      return <div>404 Not found</div>
    }

    return <FolderView folder={folder} dispatch={dispatch} />;
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
