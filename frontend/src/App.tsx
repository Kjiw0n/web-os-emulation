import { useState } from "react";
import BootPage from "./pages/BootPage";
import DesktopPage from "./pages/DesktopPage";

function App() {
  const [isBooted, setIsBooted] = useState(false);

  if (!isBooted) {
    return <BootPage onBoot={() => setIsBooted(true)} />;
  }

  return <DesktopPage />;
}

export default App;
