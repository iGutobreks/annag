import { invoke } from "@tauri-apps/api/tauri";
import User from "./components/user/Authenticated.js";

function App() {
  return (
    <div className="container">
      <User />
    </div>
  );
}

export default App;
