import { useEffect, useState } from 'react'

import './App.scss'
import SideNav from './components/SideNav/SideNav'
import DashBoardHeader from './components/DashBoardHeader/DashBoardHeader'
import PlayersTable from './components/PlayersTable/PlayersTable'
import {NAV_ITEMS} from './constants'
import FormationOverView from './components/FormationOverView/FormationOverview'

function App() {
  const [playersData, setPlayersData] = useState(null)
  const [filteredPlayersData, setFilteredPlayersData] = useState(null)
  const [playerTableImpot, setPlayerTableImport] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [activeNavItem, setActiveNavItem] = useState(NAV_ITEMS.MENU)

  const handleNavItemClick = (item) => {
    setActiveNavItem(item)
  }
  useEffect(() => {
    if (searchString && playersData?.length) {
      let searchedResults = playersData.filter((player) => {
        return player['Position'].toLowerCase().includes(searchString.toLowerCase()) || player['Player Name'].toLowerCase().includes(searchString.toLowerCase())
      })
      setFilteredPlayersData(searchedResults)
    } else {
      setFilteredPlayersData(playersData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString])

  const handleImortModalClickInPage = () => {
    playerTableImpot && playerTableImpot()
  }

  return (
    <div className='root-app'>
      <SideNav activeNavItem={activeNavItem} handleNavItemClick={handleNavItemClick} />
      <div className='right-section'>
        <DashBoardHeader
          playersData={playersData}
          setPlayersData={setPlayersData}
          setPlayerTableImport={setPlayerTableImport}
          searchString={searchString}
          setSearchString={setSearchString}
          setFilteredPlayersData={setFilteredPlayersData}
          activeNavItem={activeNavItem}
        />
        {(activeNavItem === NAV_ITEMS.MENU) && <PlayersTable
          filteredPlayersData={filteredPlayersData}
          handleImortModalClickInPage={handleImortModalClickInPage}
          setFilteredPlayersData={setFilteredPlayersData}
          setPlayersData={setPlayersData}
          searchString={searchString}
          playersData={playersData}
        />}
        {(activeNavItem === NAV_ITEMS.GROUP) && 
        <FormationOverView
        playersData={playersData}
        />
        }
      </div>

    </div>
  )
}

export default App
