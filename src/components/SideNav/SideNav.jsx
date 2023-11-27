import { NAV_ITEMS } from '../../constants'
import Logo from '../../assets/logo.svg'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';
import PropTypes from 'prop-types';


const SideNav = ({ activeNavItem, handleNavItemClick }) => {

    return <nav className="navigation-root">
        <div className="logo"><img src={Logo} /></div>
        <div className="nav">
            <div className={activeNavItem === NAV_ITEMS.MENU ? "nav-item nav-item-active" : "nav-item"} onClick={() => handleNavItemClick(NAV_ITEMS.MENU)}><IconButton><MenuIcon /></IconButton></div>
            <div className={activeNavItem === NAV_ITEMS.GROUP ? "nav-item nav-item-active" : "nav-item"} onClick={() => handleNavItemClick(NAV_ITEMS.GROUP)}><IconButton><GroupsIcon /></IconButton></div>
        </div>
    </nav>
}
SideNav.propTypes = {
    activeNavItem: PropTypes.string,
    handleNavItemClick: PropTypes.func,
}

export default SideNav