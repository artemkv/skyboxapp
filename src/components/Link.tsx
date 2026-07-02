import React from 'react';
import { AppEvent, EventType } from '../events';
import { Dispatch } from '../hooks/useReducer';

interface LinkProps {
    to: string;
    className?: string;
    children: React.ReactNode;
    dispatch: Dispatch<AppEvent>;
}

const Link: React.FC<LinkProps> = (props) => {
    const to = props.to;
    const className = props.className;
    const children = props.children;
    const dispatch = props.dispatch;

    const triggerNavigation = (e: React.SyntheticEvent) => {
        if (!e.defaultPrevented) {
            dispatch({
                type: EventType.NavigationRequested,
                path: to
            });
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={className}
            style={{
                cursor: 'pointer',
                userSelect: 'none', /* Prevents text selection highlighting on long-taps in mobile */
                WebkitTapHighlightColor: 'transparent' /* Removes the default blue tap-flash box on iOS */
            }}
            onClick={triggerNavigation}
            onKeyDown={(e) => {
                // Allows desktop users to activate the link using Enter or Space bar
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerNavigation(e);
                }
            }}
        >
            {children}
        </div>
    );
}

export default Link;