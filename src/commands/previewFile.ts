import { CommandType, PreviewFileCommand } from "../commands";
import { FileTreeNode_File, NavigateForward } from "../model";

export const PreviewFile = (
    seq: number,
    fileNode: FileTreeNode_File,
    navigate: NavigateForward
): PreviewFileCommand => ({
    seq,
    type: CommandType.PreviewFile,
    fileNode,
    navigate,
    execute: async () => {
        // TODO: move all route constants to a single place
        const link = `/preview/${[...fileNode.fullPath, fileNode.name].join("/")}`;
        navigate(link);
    },
});