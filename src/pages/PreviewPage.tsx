import { IonContent, IonPage } from '@ionic/react';
import './PreviewPage.css';
import { AppState, InAppState } from '../model';
import { Dispatch } from '../hooks/useReducer';
import { AppEvent } from '../events';
import { useParams } from 'react-router';
import TextPreview from '../components/Preview/TextPreview';

interface PreviewPageProps {
    state: AppState;
    dispatch: Dispatch<AppEvent>;
}

// TODO: show (state.folderMeta.errors) somehow
const PreviewPage: React.FC<PreviewPageProps> = (props) => {
    const state = props.state;
    const dispatch = props.dispatch;

    const params = useParams() as { [key: string]: string };

    if (state.inAppState.state != InAppState.Ready) {
        return null;
    }

    const path = params.path;

    return (
        <IonPage>
            <IonContent fullscreen>
                <TextPreview content={path} />
            </IonContent>
        </IonPage>
    );
};

export default PreviewPage;
