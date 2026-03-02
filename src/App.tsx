import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./providers/UserProvider";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
