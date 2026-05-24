import { Routes, Route } from 'react-router-dom'
import PushtimargApp from './context/AppContext'
import { ROUTES } from './constants/routes'

// Page imports
import { HomeScreen } from './pages/HomeScreen'
import { SearchScreen } from './pages/SearchScreen'
import { LibraryScreen } from './pages/LibraryScreen'
import { SettingsScreen } from './pages/SettingsScreen'
import { LoginScreen } from './pages/LoginScreen'
import { CategoryScreen } from './pages/CategoryScreen'
import { ReadScreen } from './pages/ReadScreen'
import { CalendarScreen } from './pages/CalendarScreen'
import { ProfileScreen } from './pages/ProfileScreen'
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen'
import { VerifyEmailScreen } from './pages/VerifyEmailScreen'

function App() {
  return (
    <Routes>
      <Route element={<PushtimargApp />}>
        <Route path={ROUTES.HOME} element={<HomeScreen />} />
        <Route path={ROUTES.SEARCH} element={<SearchScreen />} />
        <Route path={ROUTES.LIBRARY} element={<LibraryScreen />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsScreen />} />
        <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
        <Route path={ROUTES.CATEGORY} element={<CategoryScreen />} />
        <Route path={ROUTES.READ} element={<ReadScreen />} />
        <Route path={ROUTES.CALENDAR} element={<CalendarScreen />} />
        <Route path={ROUTES.PROFILE} element={<ProfileScreen />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordScreen />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailScreen />} />
      </Route>
    </Routes>
  )
}

export default App
