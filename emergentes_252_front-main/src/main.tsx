// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Cadastro from './Cadastro.tsx'
import App from './App.tsx';
import Login from './Login.tsx'; 
import Detalhes from './Detalhes.tsx';
import MinhasPropostas from './MinhasPropostas.tsx';

import Layout from './Layout.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:sapatoId', element: <Detalhes /> },
      { path: 'minhasPropostas', element: <MinhasPropostas /> },
      { path: 'cadastro', element: <Cadastro />}
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
);