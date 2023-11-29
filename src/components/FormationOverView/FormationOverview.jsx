import SoccerFiled from '../../assets/soccer-field.svg'
import WarningIcon from '@mui/icons-material/Warning';
import PropTypes from 'prop-types';
import { PLAYER_FIELDS } from '../../constants'
import { useState, useEffect } from 'react';
import fallBackImage from '../../assets/falll-back.png'

const POSITIONS = {
    GOAL_KEEPER: 'Goalkeeper',
    DEFENDER: 'Defender',
    MID_FIELDER: 'Midfielder',
    FORWARD: 'Forward',
}
const REQUIRED_STARTERS = {
    [POSITIONS.GOAL_KEEPER]: 1,
    [POSITIONS.DEFENDER]: 4,
    [POSITIONS.MID_FIELDER]: 3,
    [POSITIONS.FORWARD]: 3,
}
const getUniqueIdOfPlayer = (imageUrl) => {
    return imageUrl.split('/card')[0].split('/').at(-1)
}
const POSISTION_BY_GROUP = {
    [POSITIONS.GOAL_KEEPER]: [],
    [POSITIONS.DEFENDER]: [],
    [POSITIONS.MID_FIELDER]: [],
    [POSITIONS.FORWARD]: [],
}
const FormationOverView = ({ playersData }) => {
    const [paleyersOnField, setPaleyersOnField] = useState(POSISTION_BY_GROUP);
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [hasErrorInImageLoad, setHasErrorInImageLoad] = useState(false)
    useEffect(() => {
        if (playersData) {
            const updatedPlyersOnField = structuredClone(POSISTION_BY_GROUP)
            for (let i = 0; i < playersData.length; i++) {
                if (playersData[i][PLAYER_FIELDS.STARTER] === 'Yes') {
                    updatedPlyersOnField[playersData[i][PLAYER_FIELDS.POSITION]].push(playersData[i])
                }
            }
            setPaleyersOnField(updatedPlyersOnField)
            if (updatedPlyersOnField[POSITIONS.GOAL_KEEPER].length) {
                setSelectedPlayer(updatedPlyersOnField[POSITIONS.GOAL_KEEPER][0])
            }
        }
        return () => {
            setPaleyersOnField(POSISTION_BY_GROUP)
            setHasErrorInImageLoad(false)
            setSelectedPlayer(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getStarters = () => {
        let hasMoreStarters = false
        let hasLessStarters = false
        let hasEnoughStarters = false
        if (!playersData) {
            return {
                hasMoreStarters,
                hasLessStarters: true,
            }
        }
        const result = {
            [POSITIONS.GOAL_KEEPER]: paleyersOnField[POSITIONS.GOAL_KEEPER].length,
            [POSITIONS.DEFENDER]: paleyersOnField[POSITIONS.DEFENDER].length,
            [POSITIONS.MID_FIELDER]: paleyersOnField[POSITIONS.MID_FIELDER].length,
            [POSITIONS.FORWARD]: paleyersOnField[POSITIONS.FORWARD].length,
        }
        const resultKeys = Object.keys(result)
        for (let i = 0; i < resultKeys.length; i++) {
            const posistion = resultKeys[i]
            if (result[posistion] < REQUIRED_STARTERS[posistion]) {
                hasLessStarters = true
                hasEnoughStarters = false
                break
            } else if (result[posistion] > REQUIRED_STARTERS[posistion]) {
                hasMoreStarters = true
                hasEnoughStarters = false
                break
            } else {
                hasEnoughStarters = true
            }
        }

        return {
            hasMoreStarters,
            hasLessStarters,
            hasEnoughStarters
        }
    }

    const isPlayerSelected = (player) => {
        const selectedPlayerId = getUniqueIdOfPlayer(selectedPlayer[PLAYER_FIELDS.PLAYER_IMAGE])
        const playerId = getUniqueIdOfPlayer(player[PLAYER_FIELDS.PLAYER_IMAGE])
        return selectedPlayerId === playerId

    }
    const hanldePlayerSelect = (player) => {
        setSelectedPlayer(player)
        setHasErrorInImageLoad(false)
    }

    const getGoalKeeper = () => {
        const goalKeeper = paleyersOnField[POSITIONS.GOAL_KEEPER][0]

        return <div className={isPlayerSelected(goalKeeper) ? 'player-circle goal-keeper player-slected' : 'player-circle goal-keeper'} onClick={() => hanldePlayerSelect(goalKeeper)}>
            {goalKeeper[PLAYER_FIELDS.JERSY_NUMBER]}
            <span className='player-name'>{goalKeeper[PLAYER_FIELDS.PLAYER_NAME]}</span>
        </div>
    }
    const getDefenders = () => {
        const defenders = paleyersOnField[POSITIONS.DEFENDER]
        return defenders.map((defender, i) => {
            return <div key={i} className={isPlayerSelected(defender) ? `player-circle defender-${i + 1} player-slected` : `player-circle defender-${i + 1}`} onClick={() => hanldePlayerSelect(defender)}>
                {defender[PLAYER_FIELDS.JERSY_NUMBER]}
                <span className='player-name'>{defender[PLAYER_FIELDS.PLAYER_NAME]}</span>
            </div>
        })
    }
    const getMidfielders = () => {
        const midfielders = paleyersOnField[POSITIONS.MID_FIELDER]
        return midfielders.map((midfielder, i) => {
            return <div key={i} className={isPlayerSelected(midfielder) ? `player-circle midfielder-${i + 1} player-slected` : `player-circle midfielder-${i + 1}`} onClick={() => hanldePlayerSelect(midfielder)}>
                {midfielder[PLAYER_FIELDS.JERSY_NUMBER]}
                <span className='player-name'>{midfielder[PLAYER_FIELDS.PLAYER_NAME]}</span>
            </div>
        })
    }
    const getForwarders = () => {
        const forwarders = paleyersOnField[POSITIONS.FORWARD]
        return forwarders.map((forwarder, i) => {
            return <div key={i} className={isPlayerSelected(forwarder) ? `player-circle forwarder-${i + 1} player-slected` : `player-circle forwarder-${i + 1}`} onClick={() => hanldePlayerSelect(forwarder)}>
                {forwarder[PLAYER_FIELDS.JERSY_NUMBER]}
                <span className='player-name'>{forwarder[PLAYER_FIELDS.PLAYER_NAME]}</span>
            </div>
        })
    }


    return <section className="formation-overview-root">
        <div className='soccer-field'>
            <img src={SoccerFiled} alt='soccer field' />
            {
                (getStarters().hasLessStarters || !getStarters().hasEnoughStarters) ? <div className='alert-message'>
                    <h2 className='heading'><WarningIcon />{getStarters().hasLessStarters ? 'Not enough starters' : 'There are too many starters'}</h2>
                    <p className='content'>
                        {getStarters().hasLessStarters ? 'Your team doesn’t have enough starters  for one or more of the positions in the 4-3-3 formation' : 'Your team has too many starters for one or more of the positions in the 4-3-3 formation.'}
                    </p>
                </div> : <div className='player-field-positsions'>
                    {getGoalKeeper()}
                    {getDefenders()}
                    {getMidfielders()}
                    {getForwarders()}
                </div>
            }
        </div>
        <div className='player-card'>
            {getStarters().hasEnoughStarters && <>
                <span className='jersy-number-shadow'>
                    {selectedPlayer[PLAYER_FIELDS.JERSY_NUMBER]}
                </span>
                <span className='jersy-number'>{selectedPlayer[PLAYER_FIELDS.JERSY_NUMBER]}</span>
                <div className='player-image'>
                    {
                        hasErrorInImageLoad ? <img src={fallBackImage} /> : 
                        <img src={selectedPlayer[PLAYER_FIELDS.PLAYER_IMAGE]} onError={() => {
                            setHasErrorInImageLoad(true)
                        }} />
                    }
                    <div className='image-overlay' />
                </div>
                <div className='name-position'>
                    <p className='name'>{selectedPlayer[PLAYER_FIELDS.PLAYER_NAME]}</p>
                    <p className='posistion'>{selectedPlayer[PLAYER_FIELDS.POSITION]}</p>
                </div>
                <div className='player-physical-properties'>
                    <div className='column-data'>
                        <h6 className='heading'>
                            Height
                        </h6>
                        <p className='data'>{isNaN(Number(selectedPlayer[PLAYER_FIELDS.HEIGHT])) ? selectedPlayer[PLAYER_FIELDS.HEIGHT] : (Number(selectedPlayer[PLAYER_FIELDS.HEIGHT]) / 100) + ' m'}</p>
                    </div>
                    <div className='column-data'>
                        <h6 className='heading'>
                            Weight
                        </h6>
                        <p className='data'>{isNaN(Number(selectedPlayer[PLAYER_FIELDS.WEIGHT])) ? selectedPlayer[PLAYER_FIELDS.WEIGHT] : selectedPlayer[PLAYER_FIELDS.WEIGHT] + ' kg'}</p>
                    </div>
                    <div className='column-data'>
                        <h6 className='heading'>
                            Nationality
                        </h6>
                        <p className='data'><img src={selectedPlayer[PLAYER_FIELDS.FLAG_IMAGE]} alt='country flag' />{selectedPlayer[PLAYER_FIELDS.NATIONALITY]}</p>
                    </div>
                </div>
                <hr className='hr-line-data' />
                <div className='player-stats'>
                    <div className='row'>
                        <div className='column column-1'>
                            <p className='value'>{selectedPlayer[PLAYER_FIELDS.APPEARANCES]}</p>
                            <p className='heading'>Appearances</p>
                        </div>
                        <div className='column'>
                            <p className='value'>{selectedPlayer[PLAYER_FIELDS.MINUTES_PLAYED]}</p>
                            <p className='heading'>Minutes Played</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='column column-1'>
                            <p className='value'>{selectedPlayer[PLAYER_FIELDS.POSITION] === POSITIONS.GOAL_KEEPER ? selectedPlayer[PLAYER_FIELDS.CLEAN_SHEETS]: selectedPlayer[PLAYER_FIELDS.GOALS]}</p>
                            <p className='heading'>{selectedPlayer[PLAYER_FIELDS.POSITION] === POSITIONS.GOAL_KEEPER ? 'Clean sheets': 'Goals'}</p>
                        </div>
                        <div className='column'>
                            <p className='value'>{selectedPlayer[PLAYER_FIELDS.POSITION] === POSITIONS.GOAL_KEEPER ? selectedPlayer[PLAYER_FIELDS.SAVES] : selectedPlayer[PLAYER_FIELDS.ASSISTS]}</p>
                            <p className='heading'>{selectedPlayer[PLAYER_FIELDS.POSITION] === POSITIONS.GOAL_KEEPER ? 'Saves': 'Assists'}</p>
                        </div>
                    </div>
                </div>
            </>}
        </div>
    </section>
}
FormationOverView.propTypes = {
    playersData: PropTypes.array,
}

export default FormationOverView