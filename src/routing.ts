import { DefaultRoute, Route, RouteType } from "./model";


export const HOME_ROUTE = "/home";

const FOLDER_VIEW_ROUTE_PATTERN = new URLPattern({ pathname: "/home/:path*", });

export const getRoute = (path: string): Route => {
    const match = FOLDER_VIEW_ROUTE_PATTERN.exec({ pathname: path });
    if (match) {
        return {
            type: RouteType.FolderView,
            folderPath: match.pathname.groups.path ?? ""
        };
    }
    return DefaultRoute;
}