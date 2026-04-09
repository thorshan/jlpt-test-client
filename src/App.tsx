import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./providers/UserProvider";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
        <Analytics />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
