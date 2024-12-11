import { Link } from "react-router-dom";

const HeaderContent = (props: any) => {

    return (
        <div>

            {props.userAttributes && <div>
                <nav >
                    <Link to="/" style={{ display: 'flex' }}>
                        Search
                    </Link>
                    <Link to="/upload" style={{ display: 'flex' }}>
                        Uploads
                    </Link>
                </nav>
                <div className='user'>
                    <h4>{props.userAttributes?.preferred_username}</h4>
                    <button onClick={props.signOut}>Sign Out</button>
                </div>
            </div>}
        </div>
    );
};

export default HeaderContent;