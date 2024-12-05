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


import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'
import '@aws-amplify/ui-react/styles.css';


const client = generateClient<Schema>();
Amplify.configure(outputs);
function App() {

  return (







  
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
    <Router>
      <Routes>
        <Route path="/" element={<Home client={client} />} />
        <Route path="/upload" element={<File client={client} />} />
      </Routes>
    </Router>
        </main>
      )}
    </Authenticator>

  );
}

export default App;
