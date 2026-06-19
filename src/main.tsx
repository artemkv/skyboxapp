import React from 'react';
import { createRoot } from 'react-dom/client';
import AppStatefulContainer from './AppStatefulContainer';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AppStatefulContainer />
  </React.StrictMode>
);