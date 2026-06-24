import "./TextPreview.css";
import { memo } from "react";

interface TextPreviewProps {
    content: string;
    // dispatch: Dispatch<AppEvent>;
}

const TextPreview: React.FC<TextPreviewProps> = memo((props) => {
    const content = props.content;
    // const dispatch = props.dispatch;

    return <div>
        {content}
    </div>
});

export default TextPreview;