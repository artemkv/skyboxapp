import { IonIcon } from "@ionic/react";
import { documentOutline, folderOutline } from "ionicons/icons";
import { FileTreeNode, FileTreeNode_File, FileTreeNode_Folder, TreeNodeType } from "../model";
import "./FolderView.css";
import { memo } from "react";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";
import ProgressIndicator from "./ProgressIndicator";
import Link from "./Link";

interface FolderViewProps {
    pendingDownload: boolean;
    folder: FileTreeNode_Folder
    dispatch: Dispatch<AppEvent>;
}

const FolderView: React.FC<FolderViewProps> = memo((props) => {
    const pendingDownload = props.pendingDownload;
    const folder = props.folder;
    const dispatch = props.dispatch;

    // TODO: sort folders first
    // TODO: AI code
    const nodes = folder.nodes.sort((a, b) => {
        // folders first
        if (a.type !== b.type) {
            return a.type === TreeNodeType.Folder ? -1 : 1;
        }

        // alphabetical, case-insensitive
        return a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
        });
    });

    const onFileClicked = (node: FileTreeNode_File) => {
        dispatch({
            type: EventType.FileDownloadRequested,
            fileNode: node
        });
    }

    const getFolderEntry = (node: FileTreeNode, idx: number) => {
        if (node.type == TreeNodeType.File) {
            return <div
                key={idx}
                className="folder-entry"
                onClick={() => onFileClicked(node)}>
                <span className='file-entry-icon'>
                    <IonIcon icon={documentOutline} />
                </span>
                {node.name}
            </div>;
        }

        // TODO: move all route constants to a single place
        return <Link
            key={idx}
            to={"/home/" + node.fullPath.join("/")}
            dispatch={dispatch}>
            <div className="folder-entry">
                <span className='folder-entry-icon'>
                    <IonIcon icon={folderOutline} />
                </span>
                {node.name}
            </div>
        </Link>;
    }

    return <div className="folder-view">
        {pendingDownload ?
            <div className="overlay">
                <ProgressIndicator />
            </div> : null}
        {nodes.map((x, idx) => getFolderEntry(x, idx))}
    </div>
});

export default FolderView;