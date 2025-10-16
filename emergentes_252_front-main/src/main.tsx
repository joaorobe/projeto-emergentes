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
import AdminPropostas from './admin/AdminReservas.tsx';
import AdminEstoqueGeral from './admin/AdminEstoqueGeral.tsx';
import AdminEstoque from './admin/AdminEstoque';
import AdminReservas from './admin/AdminReservas';
import AdminClientes from './admin/AdminClientes';
import AdminClienteReservas from './admin/AdminClienteReservas';

import Layout from './Layout.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const rotas = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLogin />,  
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> }, 
      { path: "sapatos", element: <AdminSapatos /> },         
      { path: "sapatos/novo", element: <AdminNovoSapato /> }, 
      { path: "propostas", element: <AdminPropostas /> },
      { path: "estoques", element: <AdminEstoqueGeral />},
      { path: "sapatos/estoque/:sapatoId", element: <AdminEstoque />},
      { path: "reservas", element: <AdminReservas /> },
      { path: "clientes", element: <AdminClientes /> },
      { path: "clientes/reservas/:clienteId", element: <AdminClienteReservas /> },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:sapatoId', element: <Detalhes /> },
      { path: 'sapatos/:sapatoId', element: <Detalhes /> },
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