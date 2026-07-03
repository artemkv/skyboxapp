import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import "./TextPreview.css";
import { memo, useEffect } from "react";

interface TextPreviewProps {
    content: string;
    dispatch: Dispatch<AppEvent>;
}

const TextPreview: React.FC<TextPreviewProps> = memo((props) => {
    const content = props.content;
    const dispatch = props.dispatch;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                dispatch({
                    type: EventType.BackButtonClicked,
                });
            }
        };

        window.addEventListener("keydown", handler);
        return () => { window.removeEventListener("keydown", handler); };
    }, [dispatch]);

    return <div className="text-preview">
        {content}
    </div>
});

export default TextPreview;