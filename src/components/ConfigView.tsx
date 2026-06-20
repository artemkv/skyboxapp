import { IonButton } from "@ionic/react";
import { AppConfig } from "../model";
import "./ConfigView.css";
import { memo, useState } from "react";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";

const MAX_TEXT_SIZE = 10000;

interface ConfigViewProps {
    appConfig: AppConfig;
    dispatch: Dispatch<AppEvent>;
}

// TODO: make nice config UI
// TODO: hide behind pin
const ConfigView: React.FC<ConfigViewProps> = memo((props) => {
    const appConfig = props.appConfig;
    const dispatch = props.dispatch;

    const [textContent, setTextContent] = useState(JSON.stringify(appConfig, null, 1));

    const onSubmit = () => {
        dispatch({
            type: EventType.AppConfigSubmitted,
            // TODO: this will not be needed once I made nice UI
            appConfig: JSON.parse(textContent) as AppConfig
        });
    }

    // TODO: disable save when invalid JSON
    return <div className="config-view">
        <textarea
            id="inputtext"
            maxLength={MAX_TEXT_SIZE}
            style={{}}
            className="input-text"
            placeholder="TODO:"
            spellCheck={false}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
        />
        <div className="config-view-buttons">
            <IonButton
                disabled={false}
                shape="round"
                className="submit-button"
                onClick={() => onSubmit()}
            >
                SAVE
            </IonButton>
        </div>
    </div>
});

export default ConfigView;