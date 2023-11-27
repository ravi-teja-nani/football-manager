import { useState } from 'react'
import {
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Modal,
    TextField,
    Select,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@mui/material";
import PropTypes from 'prop-types';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const editPlayer = (data, selectedPlayer,  uniqueId) => {
    const updatedData = structuredClone(data)
    const index = updatedData.findIndex((player) => getUniqueIdOfPlayer(player['Player Image']) === uniqueId)
    updatedData[index] = {...selectedPlayer, [PLAYER_FIELDS.PLAYER_NAME]: selectedPlayer[PLAYER_FIELDS.PLAYER_NAME].trim()}
    return updatedData
}

const PLAYER_FIELDS = {
    PLAYER_NAME: 'Player Name',
    JERSY_NUMBER: 'Jersey Number',
    HEIGHT: 'Height',
    WEIGHT: 'Weight',
    STARTER: 'Starter',
    NATIONALITY: 'Nationality',
    POSITION: 'Position',
}

const PlayersTable = ({
    filteredPlayersData,
    handleImortModalClickInPage,
    setFilteredPlayersData,
    setPlayersData,
    searchString,
    playersData,
}) => {
    const hasPlayersData = filteredPlayersData?.length

    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState(null)

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
        } else {
            setEditModal(true)
        }
        setAnchorEl(null)
    }

    const onConfirmDelete = () => {
        const playerUniqueId = getUniqueIdOfPlayer(selectedPlayer['Player Image'])
        setFilteredPlayersData((prevData) => deletePlayer(prevData, playerUniqueId))
        setPlayersData((prevData) => deletePlayer(prevData, playerUniqueId))
        setSelectedPlayer(null)
        setDeleteModal(false)

    }
    const onConfirmEdit = () => {
        const playerUniqueId = getUniqueIdOfPlayer(selectedPlayer['Player Image'])
        setFilteredPlayersData((prevData) => editPlayer(prevData, selectedPlayer, playerUniqueId))
        setPlayersData((prevData) => editPlayer(prevData, selectedPlayer, playerUniqueId))
        setSelectedPlayer(null)
        setEditModal(false)
    }
    const handleDeleteModalClose = () => {
        setDeleteModal(false)
        setSelectedPlayer(null)
    }
    const handleEditModalClose = () => {
        setEditModal(false)
        setSelectedPlayer(null)
    }
    const handleOnChange = (e, key) => {
        const { value } = e.target;
        setSelectedPlayer((prevState) => {
            return {
                ...prevState,
                [key]: value,
            }
        })
    }

    const isPlayerDataChanged = () => {
        const playerUniqueId = getUniqueIdOfPlayer(selectedPlayer['Player Image'])
        const originalData = playersData.find((player) => {
            return getUniqueIdOfPlayer(player['Player Image']) === playerUniqueId
        })
        const isDataChanged = JSON.stringify(selectedPlayer) !== JSON.stringify(originalData)
        return isDataChanged
    }
    const hasEnteredInValidData = () => {
          const MIN_HEIGHT = 1, MIN_WEIGHT = 1, MIN_JERSY_NUMBER = 0
          return !selectedPlayer[PLAYER_FIELDS.PLAYER_NAME].trim() 
                 || selectedPlayer[PLAYER_FIELDS.HEIGHT] < MIN_HEIGHT
                 || selectedPlayer[PLAYER_FIELDS.WEIGHT] < MIN_WEIGHT
                 || selectedPlayer[PLAYER_FIELDS.JERSY_NUMBER] < MIN_JERSY_NUMBER
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
                <td>{isNaN(Number(player['Height'])) ? player['Height']: (Number(player['Height'] )/100) + ' m'}</td>
                <td>{isNaN(Number(player['Weight'])) ? player['Weight']: player['Weight'] + ' kg' }
                </td>
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
                <p>{searchString ? 'No records found' : 'You do not have any players on the roster'}</p>
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
        {
            editModal && <Modal
                open
                aria-labelledby="modal-edit-title"
            >
                <Box className='modal-wrapper-style player-edit-modal'>
                    <header className='modal-header-wrapper'>
                        <p className="modal-header-title">Edit Player</p>
                        <CloseIcon
                            className="modal-close"
                            onClick={handleEditModalClose}
                        />
                    </header>
                    <div className='modal-body'>
                        <div className='row'>
                            <div className='column'>
                                <p className='label'>Player Name</p>
                                <div className='input-wrapper player-input'>
                                    <TextField
                                        variant="outlined"
                                        value={selectedPlayer[PLAYER_FIELDS.PLAYER_NAME]}
                                        onChange={(e) => handleOnChange(e, PLAYER_FIELDS.PLAYER_NAME)}
                                    />
                                </div>
                            </div>
                            <div className='column'>
                                <p className='label'>Jersey Number</p>
                                <div className='input-wrapper jersy-input'>
                                    <TextField
                                        variant="outlined"
                                        type={'number'}
                                        value={selectedPlayer[PLAYER_FIELDS.JERSY_NUMBER]}
                                        onChange={(e) => handleOnChange(e, PLAYER_FIELDS.JERSY_NUMBER)}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='column'>
                                <p className='label'>Height</p>
                                <div className='input-wrapper height-input'>
                                    <TextField variant="outlined"
                                        type={'number'}
                                        value={selectedPlayer[PLAYER_FIELDS.HEIGHT]}
                                        onChange={(e) => handleOnChange(e, PLAYER_FIELDS.HEIGHT)}

                                    />
                                </div>
                            </div>
                            <div className='column'>
                                <p className='label'>Weight</p>
                                <div className='input-wrapper weight-input'>
                                    <TextField
                                        variant="outlined"
                                        type={'number'}
                                        value={selectedPlayer[PLAYER_FIELDS.WEIGHT]}
                                        onChange={(e) => handleOnChange(e, PLAYER_FIELDS.WEIGHT)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='column'>
                                <p className='label'>Nationality</p>
                                <div className='input-wrapper nationality-input'>
                                    <Select
                                        value={selectedPlayer[PLAYER_FIELDS.NATIONALITY]}
                                        onChange={(event) => { handleOnChange(event, PLAYER_FIELDS.NATIONALITY) }}
                                        IconComponent={
                                            ExpandMoreIcon
                                        }
                                    >
                                        {[...new Set(playersData.map(player => player[PLAYER_FIELDS.NATIONALITY]))].map((nationality, i) => {
                                            return <MenuItem key={i} value={nationality}>{nationality}</MenuItem>
                                        })}
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='column'>
                                <p className='label'>Position</p>
                                <div className='input-wrapper position-input'>
                                    <Select
                                        value={selectedPlayer[PLAYER_FIELDS.POSITION]}
                                        onChange={(event) => { handleOnChange(event, PLAYER_FIELDS.POSITION) }}
                                        IconComponent={
                                            ExpandMoreIcon
                                        }
                                    >
                                        {[...new Set(playersData.map(player => player[PLAYER_FIELDS.POSITION]))].map((position, i) => {
                                            return <MenuItem key={i} value={position}>{position}</MenuItem>
                                        })}
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='column'>
                                <p className='label'>Starter</p>
                                <FormControl>
                                    <RadioGroup
                                        defaultValue={selectedPlayer[PLAYER_FIELDS.STARTER]}
                                        name="radio-buttons-group"
                                        onChange={(event) => handleOnChange(event, PLAYER_FIELDS.STARTER)}
                                    >
                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <footer className='edit-modal-footer'>
                        <Button 
                        variant={(isPlayerDataChanged() && !hasEnteredInValidData() )? 'contained' : 'text'} 
                        onClick={onConfirmEdit} 
                        className='edit-button-wrapper'
                        disabled={!isPlayerDataChanged() || hasEnteredInValidData()}
                        >
                            Edit Player
                        </Button>
                    </footer>
                </Box>
            </Modal>
        }

    </section>
}

PlayersTable.propTypes = {
    filteredPlayersData: PropTypes.arrayOf(PropTypes.object),
    handleImortModalClickInPage: PropTypes.func,
    setFilteredPlayersData: PropTypes.func,
    setPlayersData: PropTypes.func,
    searchString: PropTypes.string,
    playersData: PropTypes.arrayOf(PropTypes.object),
}

export default PlayersTable