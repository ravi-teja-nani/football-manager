import './App.scss'
import SideNav from './components/SideNav/SideNav'
import DashBoardHeader from './components/DashBoardHeader/DashBoardHeader'
function App() {

  return (
    <div className='root-app'>
        <SideNav />
        <DashBoardHeader />
    </div>
  )
}

export default App
