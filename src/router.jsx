import { createBrowserRouter } from 'react-router-dom'
import PageWrapper from './components/layout/PageWrapper/PageWrapper'
import Checklist from './pages/Checklist/Checklist'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      { index: true, element: <Checklist /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])
