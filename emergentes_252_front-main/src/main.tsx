// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import CadCliente from './CadCliente.tsx'
import App from './App.tsx';
import Login from './Login.tsx'; 
import Detalhes from './Detalhes.tsx';
import MinhasPropostas from './MinhasPropostas.tsx';

import AdminLayout from './admin/AdminLayout.tsx';
import AdminLogin from './admin/AdminLogin.tsx';            
import AdminDashboard from './admin/AdminDashboard.tsx';    
import AdminSapatos from './admin/AdminSapatos.tsx';          
import AdminNovoSapato from './admin/AdminNovoSapato.tsx';          
import AdminPropostas from './admin/AdminPropostas.tsx'; 

import Layout from './Layout.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const rotas = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLogin />,   // rota do form de login sem o Layout da Área Administrativa
  },
  {
    path: "/admin",
    element: <AdminLayout />,  // layout principal do admin com menus e outlet
    children: [
      { index: true, element: <AdminDashboard /> },          // rota /admin
      { path: "sapatos", element: <AdminSapatos /> },          // rota /admin/sapatos
      { path: "sapatos/novo", element: <AdminNovoSapato /> },  // ...
      { path: "propostas", element: <AdminPropostas /> },  // ...
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:sapatoId', element: <Detalhes /> },
      { path: 'minhasPropostas', element: <MinhasPropostas /> },
      { path: 'cadCliente', element: <CadCliente /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
);