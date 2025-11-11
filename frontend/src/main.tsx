import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/home'
import Login from './pages/login'
import Tasks from './pages/tasks'
import './index.css'
import Layout from './components/layout'
import Signup from './pages/signup'
import { ROUTES } from './lib/constants'
import { StoreContext, stores } from './stores/rootStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={stores}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route element={<Layout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.TASKS} element={<Tasks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
  </StrictMode>,
)
