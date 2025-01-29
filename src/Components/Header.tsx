import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import '../CSS/Header.css';
import { useState, useEffect } from 'react';
import { fetchUserAttributes, signOut } from 'aws-amplify/auth';

const Header = () => {
  const [userAttributes, setUserAttributes] = useState<any>(null);

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log(userAttributes);
      setUserAttributes(userAttributes);
      localStorage.setItem('userAttributes', JSON.stringify(userAttributes));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const storedUserAttributes = localStorage.getItem('userAttributes');
    if (storedUserAttributes) {
      setUserAttributes(JSON.parse(storedUserAttributes));
    } else {
      handleFetchUserAttributes();
    }
  }, []);

  return (
    <header>
      <div className='imgContainer'>
        <img src="https://download.logo.wine/logo/Avis_Car_Rental/Avis_Car_Rental-Logo.wine.png" alt="Avis Logo" />
      </div>
      {userAttributes && (
        <nav>
          <Link to="/" style={{ display: 'flex' }}>
            Search
          </Link>
          <Link to="/upload" style={{ display: 'flex' }}>
            Upload
          </Link>
          <Link to="/vantage" style={{ display: 'flex' }}>
            Vantage
          </Link>
          <Link to="/transactions" style={{ display: 'flex' }}>
            Transactions
          </Link>
        </nav>
      )}
      {userAttributes && (
        <div className='user'>
          <h4>{userAttributes?.preferred_username}</h4>
          <button onClick={() => {
            signOut();
            localStorage.removeItem('userAttributes');
          }}>Sign Out</button>
        </div>
      )}
    </header>
  );
};

export default Header;