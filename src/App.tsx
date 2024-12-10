import Home from "./Components/Home"
import Upload from "./Components/Upload";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource";

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'


const client = generateClient<Schema>();
Amplify.configure(outputs);

import { fetchUserAttributes } from 'aws-amplify/auth';
import { useEffect, useState } from "react";
import Header from "./Components/Header";
import '@aws-amplify/ui-react/styles.css';

function App() {
  const [ userAttributes, setUserAttributes] = useState<any>();

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log(userAttributes);
      setUserAttributes(userAttributes)
    } catch (error) {
      console.log(error);
    }
   
  }
 /* useEffect(() => {
    handleFetchUserAttributes()
  }, []);*/

  return (
    <Router>
             
    {false && <Authenticator hideSignUp={false} >
      {({ signOut}) => (
        
        <main>
             <Header userAttributes= {userAttributes} signOut={signOut}/>
        
      <div className="content">
        <Routes>
          <Route path="/" element={<Home client={client} />} />
          <Route path="/upload" element={<Upload client={client} />} />
        </Routes>
      </div>

        </main>
      )}
    </Authenticator>}

   {true &&  
    <main>
      {<Header />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home client={client} />} />
          <Route path="/upload" element={<Upload client={client} />} />
        </Routes>
      </div>
    </main>}

        </Router>
  );
}

export default App;
