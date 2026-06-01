import { lazy } from 'react';
import type { ReactNode } from 'react';
import { IoCart, IoListCircleSharp, IoReceiptOutline, IoCog, IoGridOutline, IoPeopleOutline, IoCartOutline, IoCashOutline, IoAlbumsOutline } from 'react-icons/io5';

export interface RouteConfig {
  path: string;
  label?: string;
  element: ReactNode;
  showInMenu: boolean;
  isProtected: boolean;
  icon?: ReactNode;
  children?: RouteConfig[];
}

const LoginPage = lazy(() => import('@/modules/Auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/modules/Auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/modules/Auth/pages/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('@/modules/Auth/pages/AuthCallbackPage'));
const SupplierPage = lazy(() => import('@/modules/Supplier/pages/SupplierPage'));
const IngredientPage = lazy(() => import('@/modules/Ingredient/pages/IngredientPage'));
const RecipePage = lazy(() => import('@/modules/Recipe/pages/RecipePage'));
const MenuPage = lazy(() => import('@/modules/Menu/pages/MenuPage'));
const CustomerPage = lazy(() => import('@/modules/Customer/pages/CustomerPage'));
const OrderPage = lazy(() => import('@/modules/Order/pages/OrderPage'));
const InventoryPage = lazy(() => import('@/modules/Inventory/pages/InventoryPage'));
const ExpensePage = lazy(() => import('@/modules/Expense/pages/ExpensePage'));
const ConfigPage = lazy(() => import('@/modules/Config/pages/ConfigPage'));
const DashboardPage = lazy(() => import('@/modules/Dashboard/pages/DashboardPage'));

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    label: '',
    element: <LoginPage />,
    showInMenu: false,
    isProtected: false,
  },
  {
    path: '/forgot-password',
    label: '',
    element: <ForgotPasswordPage />,
    showInMenu: false,
    isProtected: false,
  },
  {
    path: '/reset-password',
    label: '',
    element: <ResetPasswordPage />,
    showInMenu: false,
    isProtected: false,
  },
  {
    path: '/auth/callback',
    label: '',
    element: <AuthCallbackPage />,
    showInMenu: false,
    isProtected: false,
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    element: <DashboardPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoGridOutline />,
  },
  {
    path: '/recipes',
    label: 'Recetas',
    element: <RecipePage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoReceiptOutline />,
  },
  {
    path: '/menus',
    label: 'Menús',
    element: <MenuPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoAlbumsOutline />,
  },
  {
    path: '/suppliers',
    label: 'Proveedores',
    element: <SupplierPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoCart />,
  },
  {
    path: '/ingredients',
    label: 'Ingredientes',
    element: <IngredientPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoListCircleSharp />,
  },
  {
    path: '/inventory',
    label: 'Inventario',
    element: <InventoryPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoCartOutline />,
  },
  {
    path: '/orders',
    label: 'Ventas',
    element: <OrderPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoCashOutline />,
  },
  {
    path: '/customers',
    label: 'Clientes',
    element: <CustomerPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoPeopleOutline />,
  },
  {
    path: '/expenses',
    label: 'Gastos',
    element: <ExpensePage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoCashOutline />,
  },
  {
    path: '/config',
    label: 'Configuración',
    element: <ConfigPage />,
    showInMenu: true,
    isProtected: true,
    icon: <IoCog />,
  },
];

export default routesConfig;
