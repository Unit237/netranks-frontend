import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import { loadLanguage } from './localization/language';
import { router } from './router';
import AppTheme from './templates/shared-theme/AppTheme';

loadLanguage();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AppTheme>
    <CssBaseline enableColorScheme />
    <RouterProvider router={router} />
  </AppTheme>
  // </StrictMode>,
)

export function LoadingLite() {
  return (
    <div className="make-visible-slowly" style={{ flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100vh", fontSize: "xx-large" }}>
      NetRanks
      <br /><br />
      Command Center for AI Visibility
    </div>
  );
}