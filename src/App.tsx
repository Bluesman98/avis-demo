import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Upload from "./Components/Upload";
import SkillList from "./Components/SkillList";
import Vantage from "./Components/Vantage";
import Transaction from "./Components/Transaction";
import TransactionList from "./Components/TransactionList";
import NotFound from "./Components/NotFound";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import Export from "./Components/Export";

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
                <Route path="/skills" element={<SkillList />} />
                <Route path="/vantage" element={<Vantage  client={client}/>} />
                <Route path="/transaction/:id" element={<Transaction />} />
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/transactions/export" element={<Export />} />
                <Route path="*" element={<NotFound />} />
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
        <img src="https://logos-world.net/wp-content/uploads/2022/05/Avis-Symbol-700x394.png" alt="Avis Logo" />
      </div>
    );
  }
};

export default App;
