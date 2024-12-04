import Home from "./Components/Home"
import '@aws-amplify/ui-react/styles.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import File from "./Components/File";

function App() {


  return (



    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/upload" element={<File />} />
      </Routes>
    </Router>


  );
}

export default App;
