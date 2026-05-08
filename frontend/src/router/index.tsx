import { createBrowserRouter } from 'react-router-dom';
import { PatientsPage } from '../features/patients/pages/PatientsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PatientsPage />,
  },
]);
