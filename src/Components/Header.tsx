import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import '../CSS/Header.css';

const Header = (props: any) => {
    return (
        <header>
            <div className='imgContainer'>  <img src="https://logos-world.net/imageup/Avis/Avis_(7).png"/></div>
             
            <nav >
          <Link to="/" style={{display: 'flex'}}>
           {true && <button style={{marginBottom: '1rem', flex: '1'}}>Search</button>} 
          </Link>
          <Link to="/upload" style={{display: 'flex'}}>
           {true && <button style={{marginBottom: '1rem', flex: '1'}}>Upload</button>} 
          </Link>
            </nav>

                <div className='user'>
                <h3>Username{props.userAttributes?.preferred_username}</h3>
                    <button onClick={props.signOut}>Sign Out</button>
                </div>
        </header>
    );
};

export default Header;