import Home from "./Components/Home"
import File from "./Components/File";
import '@aws-amplify/ui-react/styles.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home client={client} />} />
        <Route path="/upload" element={<File client={client} />} />
      </Routes>
    </Router>
  );
}

export default App;
