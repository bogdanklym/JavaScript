import './Navbar.css'
const Navbar = () => {
    return (
        <div className='nav'>
            <dv className="navlogo">Ev-olution</dv>
            <ul className="navmenu">
                <li>Home</li>
                <li>Explore</li>
                <li>About</li>
                <li className='nav-contact'>Contact</li>
            </ul>
        </div>
    )
}

export default Navbar