import { useState } from 'react';
import Logo from '../../assets/logo.svg'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import GroupsIcon from '@mui/icons-material/Groups';

const NAV_ITEMS = {
    MENU: 'menu',
    GROUP: 'group',
}

const SideNav = () => {
    const [activeNavItem, setActiveNavItem] = useState(NAV_ITEMS.MENU)
    const handleNavItemClick = (item) => {
         setActiveNavItem(item)
    }
    return <nav className="navigation-root">
        <div className="logo"><img src={Logo}/></div>
        <div className="nav">
            <div className={activeNavItem === NAV_ITEMS.MENU ? "nav-item nav-item-active" : "nav-item"} onClick={() => handleNavItemClick(NAV_ITEMS.MENU)}><IconButton><MenuIcon/></IconButton></div>
            <div className={activeNavItem === NAV_ITEMS.GROUP ? "nav-item nav-item-active" : "nav-item"} onClick={() => handleNavItemClick(NAV_ITEMS.GROUP)}><IconButton><GroupsIcon/></IconButton></div>
        </div>
    </nav>
}

export default SideNav