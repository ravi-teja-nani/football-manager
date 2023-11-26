import { useState } from 'react'
import {
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Modal
} from "@mui/material";
import PropTypes from 'prop-types';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const MENU_ITEMS = {
    EDIT: 'edit',
    DELETE: 'delete'
}

const getUniqueIdOfPlayer = (imageUrl) => {
    return imageUrl.split('/card')[0].split('/').at(-1)
}

const deletePlayer = (data, uniqueId) => {
    const result = data.filter((player) => {
        const id = getUniqueIdOfPlayer(player['Player Image'])
        return id !== uniqueId
    })
    return result
}

const PlayersTable = ({
    filteredPlayersData,
    handleImortModalClickInPage,
    setFilteredPlayersData,
    setPlayersData,
    searchString,
}) => {
    const hasPlayersData = filteredPlayersData?.length

    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [deleteModal, setDeleteModal] = useState(false)
    const [seletedPlayer, setSelectedPlayer] = useState(null)

    const handleMenuClick = (event, player) => {
        setAnchorEl(event.currentTarget);
        setSelectedPlayer(player)
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPlayer(null)
    };

    const handleMenuItemClick = (item) => {
        if (item === MENU_ITEMS.DELETE) {
            setDeleteModal(true)
            setAnchorEl(null)
        } else {

        }
    }

    const onConfirmDelete = () => {
        const playerUniqueId = getUniqueIdOfPlayer(seletedPlayer['Player Image'])
        setFilteredPlayersData((prevData) => deletePlayer(prevData, playerUniqueId))
        setPlayersData((prevData) => deletePlayer(prevData, playerUniqueId))
        setSelectedPlayer(null)
        setDeleteModal(false)

    }
    const handleDeleteModalClose = () => {
        setDeleteModal(false)
        setSelectedPlayer(null)
    }

    const getPlayersDataRows = () => {
        return filteredPlayersData.map((player, i) => {
            return <tr key={i}>
                <td>
                    <span className="player-name">
                        <img src={player['Flag Image']} alt='country flag' /><span>{player['Player Name']}</span>
                    </span>
                </td>
                <td>{player['Jersey Number']}</td>
                <td>{player['Starter']}</td>
                <td>{player['Position']}</td>
                <td>{player['Height']}</td>
                <td>{player['Weight']}</td>
                <td>{player['Nationality']}</td>
                <td>{player['Appearances']}</td>
                <td>{player['Minutes Played']}</td>
                <td>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleMenuClick(event, player)}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                </td>
            </tr >
        })
    }

    return <section className="players-table-root">
        <table className="players-table">
            <thead>
                <tr>
                    <th>Player Name</th>
                    <th>Jersey Number</th>
                    <th>Starter</th>
                    <th>Position</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Nationality</th>
                    <th>Appearances</th>
                    <th>Minutes Played</th>
                    {hasPlayersData && <th></th>}
                </tr>
            </thead>

            {hasPlayersData ? <tbody>{getPlayersDataRows()}</tbody> : <></>}

        </table>
        {
            !hasPlayersData && <div className="no-players-data">
                <p>{searchString ? 'No records found':  'You do not have any players on the roster'}</p>
                {!searchString && <Button varient="outined" onClick={handleImortModalClickInPage}>Import Team</Button>}
            </div>
        }

        <Menu
            id="long-menu"
            MenuListProps={{
                'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
                style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                    transform: 'translate(-28%, -17%)',
                    background: '#2D2D2D',
                    color: '#CBCBCB',
                    padding: '16px 16px 24px 16px',
                    borderRadius: '8px',
                },
            }}
            className='action-menu'
        >
            <div className='actions-heading'><h3>Actions</h3><CloseIcon onClick={handleMenuClose} className='action-menu-close' /></div>
            <MenuItem onClick={() => handleMenuItemClick(MENU_ITEMS.EDIT)} disableRipple>
                <EditIcon />
                <span>Edit Player</span>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(MENU_ITEMS.DELETE)} disableRipple>
                <DeleteOutlineIcon />
                <span>Delete Player</span>
            </MenuItem>
        </Menu>

        <Modal
            open={deleteModal}
            aria-labelledby="modal-delete-title"
            aria-describedby="modal-delete-description"
        >
            <Box className='modal-wrapper-style player-delete-modal'>
                <header className='modal-header-wrapper'>
                    <p className="modal-header-title">Are you sure?</p>
                    <CloseIcon
                        className="modal-close"
                        onClick={handleDeleteModalClose}
                    />
                </header>
                <p className='modal-body'> This action cannot be undone. </p>
                <footer className='delete-modal-footer'>
                    <Button variant='outlined' className='canecel-button' onClick={handleDeleteModalClose} >
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={onConfirmDelete} className='delete-button-wrapper'>
                        Delete
                    </Button>
                </footer>
            </Box>
        </Modal>
    </section>
}

PlayersTable.propTypes = {
    filteredPlayersData: PropTypes.arrayOf(PropTypes.object),
    handleImortModalClickInPage: PropTypes.func,
    setFilteredPlayersData: PropTypes.func,
    setPlayersData: PropTypes.func,
    searchString: PropTypes.string,
}

export default PlayersTable