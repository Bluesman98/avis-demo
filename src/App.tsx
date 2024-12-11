import Home from "./Components/Home";
import Upload from "./Components/Upload";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Header from "./Components/Header";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();
Amplify.configure(outputs);

function App() {
  return (
    <Router>
      <main>
        {true && (
          <Authenticator hideSignUp={false} components={components}>
            <Header />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home client={client} />} />
                <Route path="/upload" element={<Upload client={client} />} />
              </Routes>
            </div>
          </Authenticator>
        )}
      </main>
    </Router>
  );
}

const components = {
  Header() {
    return (
      <div className="header-image-container">
        {" "}
        <img src="https://logos-world.net/wp-content/uploads/2022/05/Avis-Symbol-700x394.png" />
      </div>
    );
  },
};

export default App;
