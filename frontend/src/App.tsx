import { useState } from "react";
import BootPage from "./pages/BootPage";
import DesktopPage from "./pages/DesktopPage";

function App() {
  const [isBooted, setIsBooted] = useState(false);

  const onBoot = () => {
    // system/boot API 호출 필요
    setIsBooted(true);
  };

  if (!isBooted) {
    return <BootPage onBoot={onBoot} />;
  }

  return <DesktopPage />;
}

export default App;
