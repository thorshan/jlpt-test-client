import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./providers/UserProvider";
import { Analytics } from "@vercel/analytics/react";

import { HelmetProvider } from "react-helmet-async";

const App = () => {
  return (
    <HelmetProvider>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
          <Analytics />
        </BrowserRouter>
      </UserProvider>
    </HelmetProvider>
  );
};

export default App;
