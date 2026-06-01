# LaCocinita — Specification Document (spec.md)

> **Versión:** 1.0.0  
> **Estado:** Aprobado  
> **Arquitecto:** Principal Software Architect  
> **Fecha:** 2026-05-31

---

## Índice

1. [Introducción](#1-introducción)
2. [Technology Stack](#2-technology-stack)
3. [Arquitectura General](#3-arquitectura-general)
4. [Modelado de Dominio](#4-modelado-de-dominio)
5. [Patrón de Módulos](#5-patrón-de-módulos)
6. [Base de Datos (Supabase)](#6-base-de-datos-supabase)
7. [Flujo de Datos y Cálculos](#7-flujo-de-datos-y-cálculos)
8. [Sistema de Temas](#8-sistema-de-temas)
9. [Seguridad](#9-seguridad)
10. [Escalabilidad y Offline-First](#10-escalabilidad-y-offline-first)
11. [Testing](#11-testing)
12. [DevOps y Deploy](#12-devops-y-deploy)
13. [Plan de Migración JS → TypeScript](#13-plan-de-migración-js--typescript)
14. [Roadmap Post-spec](#14-roadmap-post-spec)

---

## 1. Introducción

### 1.1 Propósito

LaCocinita es una plataforma **todo-en-uno** para emprendedores de comida (cocineros caseros y dueños de pequeños negocios). Centraliza:

- Gestión de **recetas** con cálculo inteligente de costos y precios de venta
- Control de **inventario** de ingredientes
- Administración de **proveedores**
- Registro de **ventas y clientes**
- Configuración de **menús dinámicos**
- Control de **gastos operativos**
- **Reportes y analytics** para la toma de decisiones

Su **core diferencial** es el motor de cálculo de precios que considera: costo de ingredientes, mermas, mano de obra, gastos indirectos y margen de ganancia deseado.

### 1.2 Usuarios Objetivo

- **Cocineros caseros** que quieren profesionalizar sus ventas de comida
- **Dueños de pequeños negocios** de comida (emprendedores, caterings, pymes)

### 1.3 Modelo de Usuario

**Individual** — 1 usuario = 1 negocio. Cada usuario ve exclusivamente sus datos.

---

## 2. Technology Stack

### 2.1 Stack Aprobado

| Capa | Tecnología | Versión | Notas |
|------|-----------|---------|-------|
| **Lenguaje** | TypeScript | 5.x | Estricto, con tipos generados de Supabase |
| **Framework UI** | React | 18.x | con Vite 6 |
| **Build Tool** | Vite | 6.x | |
| **State Management** | Redux Toolkit | 2.x | Con slices modulares |
| **Forms** | React Hook Form | 7.x | + Zod para validación |
| **CSS** | Tailwind CSS | 3.x | Con `primary` como color dinámico CSS variable |
| **Routing** | React Router | 7.x | Config-driven |
| **Backend/DB** | Supabase | — | Auth, PostgreSQL, Storage |
| **Fechas** | dayjs | 1.x | Reemplaza moment.js |
| **Testing** | Vitest + React Testing Library | — | |
| **UUIDs** | `crypto.randomUUID()` | — | Nativo del browser |
| **Iconos** | react-icons (Io5) | — | |

### 2.2 Dependencias Clave

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^7.0.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "@supabase/supabase-js": "^2.40.0",
    "tailwindcss": "^3.4.0",
    "dayjs": "^1.11.0",
    "react-icons": "^5.0.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vitest": "^1.3.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/user-event": "^14.5.0",
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "supabase": "^1.150.0"
  }
}
```

---

## 3. Arquitectura General

### 3.1 Principios Arquitectónicos

1. **Clean Architecture** en capas: Domain → Application → Infrastructure → Presentation
2. **Spec-Driven Development**: toda funcionalidad parte de este spec
3. **Modular por feature**: cada módulo de negocio es autocontenido
4. **Mobile-First**: todas las UI se diseñan primero para mobile, luego desktop
5. **Offline-ready**: la capa de datos se abstrae para soportar caché local en el futuro
6. **Configurable**: colores, temas, parámetros de negocio configurables por usuario
7. **Type-Safe**: TypeScript estricto desde el inicio

### 3.2 Estructura de Directorios

```
src/
├── app/                        # Configuración de la app
│   ├── App.tsx                 # Router + Providers
│   ├── main.tsx                # Entry point
│   ├── store.ts                # Redux store (combineSlices)
│   └── routes.tsx              # Configuración de rutas
│
├── types/                      # Tipos compartidos
│   ├── models.ts               # Domain models interfaces
│   ├── api.ts                  # API response/request types
│   ├── forms.ts                # Form value types
│   └── common.ts               # ApiResponse<T>, Pagination, etc.
│
├── infrastructure/             # Capa de infraestructura
│   ├── supabase/
│   │   ├── client.ts           # Singleton Supabase client
│   │   └── types.ts            # Tipos generados (Database type)
│   └── repository/
│       ├── BaseRepository.ts   # Clase base con métodos genéricos
│       ├── interfaces.ts       # IRepository<T> interfaz
│       └── implementations/
│           ├── SupplierRepository.ts
│           ├── IngredientRepository.ts
│           ├── RecipeRepository.ts
│           ├── MenuRepository.ts
│           ├── CustomerRepository.ts
│           ├── OrderRepository.ts
│           ├── ExpenseRepository.ts
│           ├── InventoryRepository.ts
│           └── ConfigRepository.ts
│
├── modules/                    # Módulos de negocio (vertical slices)
│   ├── Auth/                   # Autenticación
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   └── AuthCallbackPage.tsx
│   │   ├── store/
│   │   │   └── authSlice.ts
│   │   └── types.ts
│   │
│   ├── Supplier/
│   │   ├── pages/
│   │   │   └── SupplierPage.tsx
│   │   ├── components/
│   │   │   ├── SupplierList.tsx
│   │   │   ├── SupplierForm.tsx
│   │   │   └── SupplierCard.tsx
│   │   ├── store/
│   │   │   └── supplierSlice.ts
│   │   ├── services.ts         # Lógica de negocio del módulo
│   │   ├── validation.ts       # Esquema Zod
│   │   └── types.ts
│   │
│   ├── Ingredient/
│   │   ├── pages/
│   │   │   └── IngredientPage.tsx
│   │   ├── components/
│   │   │   ├── IngredientList.tsx
│   │   │   ├── IngredientForm.tsx
│   │   │   └── IngredientCard.tsx
│   │   ├── store/
│   │   │   └── ingredientSlice.ts
│   │   ├── services.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Recipe/
│   │   ├── pages/
│   │   │   └── RecipePage.tsx
│   │   ├── components/
│   │   │   ├── RecipeList.tsx
│   │   │   ├── RecipeForm.tsx
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── RecipeCalculator.tsx
│   │   │   └── RecipeVersionHistory.tsx
│   │   ├── store/
│   │   │   └── recipeSlice.ts
│   │   ├── services.ts         # Motor de cálculo de costos
│   │   ├── utils.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Menu/
│   │   ├── pages/
│   │   │   └── MenuPage.tsx
│   │   ├── components/
│   │   │   ├── MenuList.tsx
│   │   │   ├── MenuForm.tsx
│   │   │   └── MenuCard.tsx
│   │   ├── store/
│   │   │   └── menuSlice.ts
│   │   ├── services.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Customer/
│   │   ├── pages/
│   │   │   └── CustomerPage.tsx
│   │   ├── components/
│   │   │   ├── CustomerList.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   └── CustomerCard.tsx
│   │   ├── store/
│   │   │   └── customerSlice.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Order/                  # Ventas
│   │   ├── pages/
│   │   │   └── OrderPage.tsx
│   │   ├── components/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   └── OrderCard.tsx
│   │   ├── store/
│   │   │   └── orderSlice.ts
│   │   ├── services.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Inventory/
│   │   ├── pages/
│   │   │   └── InventoryPage.tsx
│   │   ├── components/
│   │   │   ├── InventoryList.tsx
│   │   │   ├── InventoryMovementForm.tsx
│   │   │   └── InventoryAlertBanner.tsx
│   │   ├── store/
│   │   │   └── inventorySlice.ts
│   │   ├── services.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Expense/
│   │   ├── pages/
│   │   │   └── ExpensePage.tsx
│   │   ├── components/
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   └── ExpenseCard.tsx
│   │   ├── store/
│   │   │   └── expenseSlice.ts
│   │   ├── services.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   ├── Config/
│   │   ├── pages/
│   │   │   └── ConfigPage.tsx
│   │   ├── components/
│   │   │   ├── BusinessConfig.tsx
│   │   │   ├── ThemeConfig.tsx
│   │   │   └── UnitPreferences.tsx
│   │   ├── store/
│   │   │   └── configSlice.ts
│   │   ├── services.ts
│   │   ├── validation.ts
│   │   └── types.ts
│   │
│   └── Dashboard/
│       ├── pages/
│       │   └── DashboardPage.tsx
│       ├── components/
│       │   ├── StatsCards.tsx
│       │   ├── RevenueChart.tsx
│       │   ├── RecentOrders.tsx
│       │   ├── LowStockAlerts.tsx
│       │   └── TopIngredients.tsx
│       └── store/
│           └── dashboardSlice.ts
│
├── shared/                     # Componentes y hooks compartidos
│   ├── components/
│   │   ├── ui/                 # Componentes base (design system)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── NumericField.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ImageUpload.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── hooks/
│   │   ├── useModal.ts
│   │   ├── useTheme.ts
│   │   ├── usePagination.ts
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── layout/
│   │   ├── AppLayout.tsx       # Layout principal (responsive)
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── MobileNav.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   └── store/
│       ├── themeSlice.ts       # Tema claro/oscuro + color primario
│       └── unitsSlice.ts       # Unidades de medida
│
├── adapters/                   # Transformadores (API ↔ Model)
│   ├── supplier.adapter.ts
│   ├── ingredient.adapter.ts
│   ├── recipe.adapter.ts
│   ├── menu.adapter.ts
│   ├── customer.adapter.ts
│   ├── order.adapter.ts
│   ├── expense.adapter.ts
│   └── user.adapter.ts
│
├── hooks/                      # Hooks globales
│   └── useInit.ts              # Inicialización de datos al login
│
├── services/                   # Servicios globales
│   ├── pricing.service.ts      # Motor de cálculo de precios (shared logic)
│   └── export.service.ts       # Exportación PDF
│
├── theme/                      # Configuración de temas
│   ├── ThemeProvider.tsx
│   ├── colors.ts
│   └── tokens.ts               # Design tokens
│
└── styles/
    └── globals.css              # Tailwind directives + CSS variables
```

### 3.3 Flujo de Capas (Data Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│  Page → Components → Hooks → Slice (Redux)                     │
│  (React, RHF, Zod)                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ dispatches actions / reads state
┌──────────────────────────▼──────────────────────────────────────┐
│                     APPLICATION LAYER                           │
│  services.ts → business logic, use cases                       │
│  pricing.service.ts → motor de cálculo                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ calls repository interface
┌──────────────────────────▼──────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                          │
│  Repository implementations → Supabase API                     │
│  Adapters (transform raw data → models)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │ (PostgreSQL)│
                    └─────────────┘
```

### 3.4 Principios de Diseño Shared Components

Todos los componentes en `shared/components/ui/` siguen estas reglas:

1. **Composición sobre configuración**: prefieren `children` y slots a props de configuración
2. **Accesibilidad**: todos los inputs tienen `label` asociado con `htmlFor`/`id`
3. **Responsive**: mobile-first con Tailwind
4. **Tema**: usan variables CSS (`--color-primary`, `--color-bg`, etc.) definidas en el ThemeProvider
5. **TypeScript**: props tipadas estrictamente con interfaces exportadas
6. **Testeables**: separan lógica de presentación

---

## 4. Modelado de Dominio

### 4.1 Entidades y Relaciones

```
┌───────────┐     ┌──────────────┐     ┌──────────────────┐
│  Supplier  │1──N│  Ingredient   │1──N│ RecipeIngredient  │
│ (proveedor)│     │ (ingrediente) │     │ (receta_ingred.)  │
└───────────┘     └──────────────┘     └─────┬────────────┘
                      │                       │
                      │ 1                  N  │
                      │                       │
                      │  ┌──────────────────┐ │
                      └──│    Category      │ │
                         │ (categoría)       │ │
                         └──────────────────┘ │
                                              │ N
                                   ┌──────────▼──────────┐
                                   │       Recipe         │
                                   │     (receta)         │
                                   └──────┬──────┬────────┘
                                          │ 1    │ 1
                                          │      │
                                 N        │      │ N
                          ┌──────────┐    │      │   ┌──────────────┐
                          │RecipeVer.│    │      │   │  MenuRecipe   │
                          │(versión) │    │      │   │ (menú_receta) │
                          └──────────┘    │      │   └──────┬───────┘
                                          │      │          │
                                          │      │     N    │
                              N           │     ┌┴──────────▼──┐
                    ┌──────────────────┐  │     │     Menu      │
                    │   OrderItem      │  │     │    (menú)     │
                    └────────┬─────────┘  │     └───────────────┘
                             │ N          │
                    ┌────────▼──────┐     │
                    │    Order      │     │
                    │   (venta)     │     │
                    └───────┬───────┘     │
                            │ 1           │
                            │             │
                    ┌───────▼───────┐     │
                    │   Customer    │     │
                    │   (cliente)   │     │
                    └───────────────┘     │
                                          │
                         ┌────────────────▼────────┐
                         │      Config             │
                         │  (parámetros negocio)    │
                         └─────────────────────────┘

┌───────────────┐     ┌──────────────────────┐
│   Expense      │     │   InventoryMovement   │
│ (gasto operat.)│     │ (movimiento stock)    │
└───────────────┘     └──────────────────────┘
```

### 4.2 Modelos de Dominio (TypeScript)

```typescript
// ============================================================
// types/models.ts — Domain Models
// ============================================================

// ---- Shared ----
interface BaseEntity {
  id: string;
  createdAt: string;   // ISO 8601
  userId: string;
}

interface TimestampedEntity extends BaseEntity {
  updatedAt?: string;
}

// ---- Supplier ----
interface Supplier extends TimestampedEntity {
  name: string;
  address?: string;
  phone?: string;
}

interface SupplierCreate {
  name: string;
  address?: string;
  phone?: string;
}

// ---- Category ----
interface Category extends BaseEntity {
  name: string;
  type: 'INGREDIENT' | 'RECIPE' | 'EXPENSE';
  color?: string;
  icon?: string;
}

// ---- Ingredient ----
interface Ingredient extends BaseEntity {
  name: string;
  quantity: number;        // Stock actual
  unitId: string;          // 'kg' | 'g' | 'l' | 'ml' | 'un' | ...
  unitPrice: number;       // Precio por unidad
  distributorId?: string;  // Supplier ID
  brand?: string;
  categoryId?: string;     // Category ID
  minStock?: number;       // Alerta de stock mínimo
  imageUrl?: string;
}

interface IngredientCreate {
  name: string;
  quantity: number;
  unitId: string;
  unitPrice: number;
  distributorId?: string;
  brand?: string;
  categoryId?: string;
  minStock?: number;
}

// ---- Recipe ----
interface Recipe extends BaseEntity {
  name: string;
  description?: string;
  instructions?: string;
  preparationTime: number;     // En minutos
  portionsPerRecipe: number;
  categoryId?: string;
  imageUrl?: string;
  currentVersion: number;      // Para versionado

  // Campos calculados (pueden ser computed o persistidos)
  totalIngredientsCost: number;
  indirectSpends: number;
  personalSpends: number;
  prepareCost: number;
  revenueMargin: number;
  recommendedSalesPrice: number;
  recommendedSalesPricePerPortion: number;

  // Relaciones
  ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
  ingredientId: string;
  ingredientName?: string;     // Denormalizado para display
  quantity: number;            // Cantidad usada en la receta
  unitId: string;
  cost: number;                // Costo calculado = (precioIngrediente / cantidadBase) * cantidadUsada
}

interface RecipeVersion {
  id: string;
  recipeId: string;
  version: number;
  snapshot: Recipe;            // Snapshot completo de la receta en esa versión
  changeNotes?: string;
  createdAt: string;
}

interface RecipeCreate {
  name: string;
  description?: string;
  instructions?: string;
  preparationTime: number;
  portionsPerRecipe: number;
  categoryId?: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
}

// ---- Menu ----
interface Menu extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  recipes: MenuRecipe[];
  totalPrice: number;           // Suma de precios de recetas incluidas
}

interface MenuRecipe {
  recipeId: string;
  recipeName?: string;
  portionAdjustment?: number;   // Factor de ajuste de porciones
}

// ---- Customer ----
interface Customer extends BaseEntity {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  totalOrders: number;          // Computado
  totalSpent: number;           // Computado
}

// ---- Order (Venta) ----
interface Order extends BaseEntity {
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  notes?: string;
  orderDate: string;
}

interface OrderItem {
  recipeId?: string;
  menuId?: string;
  description: string;         // "Receta X" o "Menú Y"
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// ---- Inventory Movement ----
interface InventoryMovement extends BaseEntity {
  ingredientId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  unitPrice?: number;           // Precio unitario en el momento del movimiento
  reference?: string;           // "Order #123", "Initial stock", etc.
  notes?: string;
}

// ---- Expense ----
interface Expense extends BaseEntity {
  description: string;
  amount: number;
  categoryId?: string;
  expenseDate: string;
  isRecurring: boolean;
  recurringInterval?: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  notes?: string;
}

// ---- Config ----
interface BusinessConfig extends TimestampedEntity {
  workHourlyRate: number;       // Costo por hora de trabajo (€/$)
  profitMargin: number;         // Margen de ganancia deseado (%)
  spendMargin: number;          // Margen para gastos indirectos (%)
  currency: string;             // 'EUR' | 'USD' | 'MXN' | ...
  taxRate: number;              // % de impuesto
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;         // Color primario en hex (#690375)
  language: string;             // 'es' | 'en'
}

// ---- Common API response ----
interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  error?: string;
}
```

---

## 5. Patrón de Módulos

### 5.1 Estructura de Cada Módulo

Cada módulo de negocio sigue esta estructura estandarizada:

```
modules/ModuleName/
├── pages/
│   └── ModuleNamePage.tsx     # Página principal (container)
├── components/
│   ├── ModuleNameList.tsx     # Lista de items
│   ├── ModuleNameForm.tsx     # Formulario (RHF + Zod)
│   └── ModuleNameCard.tsx     # Card individual
├── store/
│   └── moduleNameSlice.ts     # Redux slice
├── services.ts                # Lógica de negocio del módulo
├── validation.ts              # Esquema Zod
└── types.ts                   # Tipos específicos del módulo
```

### 5.2 Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Módulos (carpeta)** | PascalCase, singular | `Supplier/`, `Recipe/` |
| **Páginas** | `{ModuleName}Page.tsx` | `SupplierPage.tsx` |
| **Componentes** | PascalCase | `SupplierList.tsx` |
| **Slices** | camelCase + `Slice` | `supplierSlice.ts` |
| **Types** | camelCase | `supplier.types.ts` |
| **Validation** | `validation.ts` | `validation.ts` |
| **Services** | `services.ts` | `services.ts` |
| **Hooks** | `use{Name}.ts` | `useTheme.ts` |
| **Adaptadores** | camelCase + `.adapter.ts` | `supplier.adapter.ts` |
| **Rutas** | lowercase, plural | `/suppliers`, `/recipes` |
| **Store keys** | lowercase | `state.supplier`, `state.recipe` |

### 5.3 Patrón de Slice (Redux Toolkit)

Cada slice de datos sigue esta forma estandarizada:

```typescript
// Estado base de todo slice de datos CRUD
interface DataSliceState<T> {
  items: T[];
  selected: T | null;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
}

// Reducers estándar:
// - setItems(state, action)       → reemplaza items[]
// - addItem(state, action)        → push a items[]
// - updateItem(state, action)     → map reemplazando por id
// - removeItem(state, action)     → filter por id
// - selectItem(state, action)     → set selected
// - clearSelection(state)         → selected = null, isEditing = false
// - setEditing(state, action)     → isEditing = boolean
// - setLoading(state, action)     → loading = boolean
// - setError(state, action)       → error = string | null
```

### 5.4 Patrón de Página (Container)

```typescript
// Ejemplo: SupplierPage.tsx
function SupplierPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(state => state.supplier);
  const { isOpen, open, close } = useModal();
  const toast = useToast();

  // Cargar datos al montar
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    dispatch(setLoading(true));
    const result = await supplierRepository.getAll(userId);
    if (result.isSuccess) {
      dispatch(setItems(result.data.map(supplierAdapter.toModel)));
    } else {
      dispatch(setError(result.error));
      toast.error('Error al cargar proveedores');
    }
    dispatch(setLoading(false));
  };

  const handleAdd = async (data: SupplierCreate) => {
    const result = await supplierRepository.create(data);
    if (result.isSuccess) {
      dispatch(addItem(supplierAdapter.toModel(result.data)));
      toast.success('Proveedor creado');
      close();
    }
  };

  const handleEdit = async (data: SupplierCreate) => {
    if (!selected?.id) return;
    const result = await supplierRepository.update(selected.id, data);
    if (result.isSuccess) {
      dispatch(updateItem(supplierAdapter.toModel(result.data)));
      toast.success('Proveedor actualizado');
      close();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await supplierRepository.delete(id);
    if (result.isSuccess) {
      dispatch(removeItem(id));
      toast.success('Proveedor eliminado');
    }
  };

  return (
    <PageContainer title="Proveedores">
      <SupplierList
        items={items}
        loading={loading}
        onEdit={(item) => { dispatch(selectItem(item)); dispatch(setEditing(true)); open(); }}
        onDelete={handleDelete}
      />
      <Modal isOpen={isOpen} onClose={close}>
        <SupplierForm
          onSubmit={selected ? handleEdit : handleAdd}
          initialValues={selected}
          isEditing={isEditing}
        />
      </Modal>
    </PageContainer>
  );
}
```

### 5.5 Patrón de Formulario (React Hook Form + Zod)

```typescript
// validation.ts
import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  address: z.string().max(200).optional(),
  phone: z.string()
    .regex(/^[+]?[\d\s()-]{7,15}$/, 'Teléfono inválido')
    .optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

// SupplierForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function SupplierForm({ onSubmit, initialValues, isEditing }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: initialValues ?? { name: '', address: '', phone: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Nombre" {...register('name')} error={errors.name?.message} />
      <Input label="Dirección" {...register('address')} error={errors.address?.message} />
      <Input label="Teléfono" {...register('phone')} error={errors.phone?.message} />
      <Button type="submit" loading={isSubmitting}>
        {isEditing ? 'Actualizar' : 'Crear'}
      </Button>
    </form>
  );
}
```

### 5.6 Patrón de Repositorio

```typescript
// infrastructure/repository/interfaces.ts
interface IRepository<T, TCreate, TUpdate = TCreate> {
  getAll(userId: string): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  create(data: TCreate): Promise<ApiResponse<T>>;
  update(id: string, data: TUpdate): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<boolean>>;
}

// infrastructure/repository/BaseRepository.ts
abstract class BaseRepository<T, TCreate, TUpdate = TCreate>
  implements IRepository<T, TCreate, TUpdate> {
  
  protected abstract tableName: string;
  protected abstract adapter: { toModel: (raw: any) => T };

  async getAll(userId: string): Promise<ApiResponse<T[]>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false });
    
    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: data.map(this.adapter.toModel) };
  }
  
  async create(input: TCreate): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(input)
      .select()
      .single();
    
    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: this.adapter.toModel(data) };
  }
  
  // ... update, delete similares
}
```

---

## 6. Base de Datos (Supabase)

### 6.1 Esquema Completo

```sql
-- ============================================================
-- Tablas de Dominio
-- ============================================================

-- Tabla existente: suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name VARCHAR NOT NULL,
  address VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMP
);

-- NUEVA: categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INGREDIENT', 'RECIPE', 'EXPENSE')),
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla existente: ingredients (modificada)
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit_id TEXT NOT NULL,
  unit_price REAL NOT NULL DEFAULT 0,
  distributor_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  brand TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  min_stock REAL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla existente: recipes (modificada)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  preparation_time REAL NOT NULL DEFAULT 0,
  portions_per_recipe REAL NOT NULL DEFAULT 1,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  current_version INTEGER NOT NULL DEFAULT 1,
  
  -- Campos calculados (se almacenan para consultas rápidas)
  total_ingredients_cost REAL NOT NULL DEFAULT 0,
  indirect_spends REAL NOT NULL DEFAULT 0,
  personal_spends REAL NOT NULL DEFAULT 0,
  prepare_cost REAL NOT NULL DEFAULT 0,
  revenue_margin REAL NOT NULL DEFAULT 0,
  recommended_sales_price REAL NOT NULL DEFAULT 0,
  recommended_sales_price_per_portion REAL NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NUEVA: recipe_versions (historial de versiones)
CREATE TABLE recipe_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  preparation_time REAL,
  portions_per_recipe REAL,
  ingredients JSONB NOT NULL,        -- Snapshot de ingredientes en esta versión
  total_ingredients_cost REAL,
  personal_spends REAL,
  indirect_spends REAL,
  prepare_cost REAL,
  recommended_sales_price REAL,
  change_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, version)
);

-- Tabla existente: recipes_ingredients (modificada)
CREATE TABLE recipes_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity REAL NOT NULL,
  unit_id TEXT NOT NULL,
  cost REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NUEVA: menus
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from DATE,
  valid_to DATE,
  total_price REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NUEVA: menu_recipes
CREATE TABLE menu_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE RESTRICT,
  portion_adjustment REAL NOT NULL DEFAULT 1,
  UNIQUE(menu_id, recipe_id)
);

-- NUEVA: customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NUEVA: orders (ventas)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT,               -- Denormalizado para display rápido
  subtotal REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PENDING' 
    CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERED', 'CANCELLED')),
  payment_method TEXT NOT NULL DEFAULT 'CASH'
    CHECK (payment_method IN ('CASH', 'CARD', 'TRANSFER', 'OTHER')),
  notes TEXT,
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NUEVA: order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  menu_id UUID REFERENCES menus(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL DEFAULT 0,
  subtotal REAL NOT NULL DEFAULT 0
);

-- NUEVA: inventory_movements
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity REAL NOT NULL,
  unit_price REAL,
  reference TEXT,                   -- "Orden #123" o "Ajuste manual"
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NUEVA: expenses (gastos operativos)
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  expense_date DATE NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurring_interval TEXT CHECK (recurring_interval IN ('WEEKLY', 'MONTHLY', 'YEARLY')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla existente: config (modificada)
CREATE TABLE config (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
  work_hourly_rate REAL NOT NULL DEFAULT 10,
  profit_margin REAL NOT NULL DEFAULT 30,
  spend_margin REAL NOT NULL DEFAULT 10,
  currency TEXT NOT NULL DEFAULT 'EUR',
  tax_rate REAL NOT NULL DEFAULT 0,
  
  -- Preferencias de usuario
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  primary_color TEXT NOT NULL DEFAULT '#690375',
  language TEXT NOT NULL DEFAULT 'es',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMP,
  UNIQUE(user_id)  -- 1 config por usuario
);

-- ============================================================
-- Índices
-- ============================================================
CREATE INDEX idx_ingredients_user ON ingredients(user_id);
CREATE INDEX idx_ingredients_category ON ingredients(category_id);
CREATE INDEX idx_ingredients_distributor ON ingredients(distributor_id);
CREATE INDEX idx_recipes_user ON recipes(user_id);
CREATE INDEX idx_recipes_category ON recipes(category_id);
CREATE INDEX idx_recipes_ingredients_recipe ON recipes_ingredients(recipe_id);
CREATE INDEX idx_recipes_ingredients_ingredient ON recipes_ingredients(ingredient_id);
CREATE INDEX idx_recipe_versions_recipe ON recipe_versions(recipe_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_menus_user ON menus(user_id);
CREATE INDEX idx_menu_recipes_menu ON menu_recipes(menu_id);
CREATE INDEX idx_customers_user ON customers(user_id);
CREATE INDEX idx_inventory_movements_ingredient ON inventory_movements(ingredient_id);
CREATE INDEX idx_inventory_movements_date ON inventory_movements(created_at);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
```

### 6.2 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas basadas en `auth.uid()`:

```sql
-- Para cada tabla (ejemplo con ingredients):
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_ingredients" ON ingredients
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "users_insert_own_ingredients" ON ingredients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

Políticas idénticas para: `suppliers`, `categories`, `recipes`, `recipe_versions`, `recipes_ingredients`, `menus`, `menu_recipes`, `customers`, `orders`, `order_items`, `inventory_movements`, `expenses`, `config`.

### 6.3 Storage (Imágenes)

Se utiliza Supabase Storage con un bucket `recipe-images`:

```sql
-- Bucket: recipe-images
-- Política: usuarios pueden leer/escribir solo sus propias imágenes
-- Ruta: {userId}/{recipeId}/{uuid}.{ext}
```

---

## 7. Flujo de Datos y Cálculos

### 7.1 Motor de Cálculo de Precios

Este es el **core business logic** de la app. El cálculo sigue esta secuencia:

```
┌─────────────────────────────────────────────────────────────────┐
│                   1. Costo de Ingredientes                       │
│                                                                  │
│  Para cada ingrediente en la receta:                             │
│    costo_unitario = precio_ingrediente / cantidad_base            │
│    costo_ingrediente = costo_unitario * cantidad_usada           │
│                                                                  │
│  total_ingredients_cost = Σ costo_ingrediente                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   2. Gastos Indirectos                           │
│                                                                  │
│  indirect_spends = total_ingredients_cost * (spendMargin / 100)  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   3. Costo de Mano de Obra                       │
│                                                                  │
│  horas_trabajo = preparationTime / 60                           │
│  personal_spends = horas_trabajo * workHourlyRate               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   4. Costo de Preparación                        │
│                                                                  │
│  prepare_cost = total_ingredients_cost                          │
│                + indirect_spends                                  │
│                + personal_spends                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                   5. Precio de Venta Recomendado                 │
│                                                                  │
│  revenue_margin = profitMargin (de Config)                      │
│  recommended_sales_price = prepare_cost * (1 + revenue_margin/100)│
│  recommended_sales_price_per_portion =                           │
│       recommended_sales_price / portions_per_recipe             │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Implementación del Motor

```typescript
// services/pricing.service.ts

interface PricingInput {
  ingredients: Array<{
    ingredientId: string;
    quantity: number;
    unitId: string;
    ingredientPrice: number;    // Precio del ingrediente en su unidad base
    ingredientBaseQty: number;  // Cantidad base del ingrediente (ej: 1 kg)
  }>;
  preparationTime: number;      // minutos
  portionsPerRecipe: number;
  config: {
    workHourlyRate: number;
    profitMargin: number;
    spendMargin: number;
  };
}

interface PricingResult {
  ingredientsCost: number;
  indirectSpends: number;
  personalSpends: number;
  prepareCost: number;
  revenueMargin: number;
  recommendedSalesPrice: number;
  recommendedSalesPricePerPortion: number;
  ingredientBreakdown: Array<{
    ingredientId: string;
    cost: number;
  }>;
}

function calculatePricing(input: PricingInput): PricingResult {
  // 1. Calcular costo de cada ingrediente
  const ingredientBreakdown = input.ingredients.map(ing => {
    const unitCost = ing.ingredientPrice / ing.ingredientBaseQty;
    const cost = unitCost * ing.quantity;
    return { ingredientId: ing.ingredientId, cost };
  });

  const ingredientsCost = ingredientBreakdown.reduce((sum, i) => sum + i.cost, 0);

  // 2. Gastos indirectos
  const indirectSpends = ingredientsCost * (input.config.spendMargin / 100);

  // 3. Mano de obra
  const hoursWorked = input.preparationTime / 60;
  const personalSpends = hoursWorked * input.config.workHourlyRate;

  // 4. Costo total de preparación
  const prepareCost = ingredientsCost + indirectSpends + personalSpends;

  // 5. Precio de venta recomendado
  const revenueMargin = input.config.profitMargin;
  const recommendedSalesPrice = prepareCost * (1 + revenueMargin / 100);
  const recommendedSalesPricePerPortion = recommendedSalesPrice / input.portionsPerRecipe;

  return {
    ingredientsCost,
    indirectSpends,
    personalSpends,
    prepareCost,
    revenueMargin,
    recommendedSalesPrice,
    recommendedSalesPricePerPortion,
    ingredientBreakdown,
  };
}
```

### 7.3 Cálculo en Tiempo Real

El formulario de recetas debe mostrar el **cálculo en vivo** mientras el usuario completa los datos:

```
┌─────────────────────────────────────────────┐
│  Receta: Ensalada César                     │
│  Tiempo preparación: [15] min               │
│  Porciones: [4]                             │
├─────────────────────────────────────────────┤
│  INGREDIENTES                               │
│  ┌──────────┬──────┬──────┬────────┐       │
│  │Ingred.   │Cant  │Unidad│Costo   │       │
│  ├──────────┼──────┼──────┼────────┤       │
│  │Lechuga   │ 200  │ g    │ $0.50  │       │
│  │Pollo     │ 300  │ g    │ $2.40  │       │
│  │Aderezo   │  50  │ ml   │ $0.80  │       │
│  └──────────┴──────┴──────┴────────┘       │
├─────────────────────────────────────────────┤
│  COSTOS (se actualizan al instante)         │
│  ┌─────────────────────────────────────┐   │
│  │ Costo ingredientes    $3.70         │   │
│  │ Gastos indirectos 10% $0.37         │   │
│  │ Mano de obra (15min)  $2.50         │   │
│  │─────────────────────────────────────│   │
│  │ Costo preparación     $6.57         │   │
│  │ Margen ganancia 30%   $1.97         │   │
│  │─────────────────────────────────────│   │
│  │ Precio Venta Recom.   $8.54         │   │
│  │ Precio por porción    $2.14         │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 7.4 Módulo Order (Ventas)

#### 7.4.1 Estructura del Módulo

El módulo Order sigue el patrón estándar de CRUD con las siguientes particularidades:

```
modules/Order/
├── pages/
│   └── OrderPage.tsx           # CRUD completo con Modal + Redux
├── components/
│   ├── OrderList.tsx           # Lista con filtros por estado + EmptyState
│   ├── OrderForm.tsx           # Formulario con items dinámicos
│   └── OrderCard.tsx           # Card con badge de estado, método de pago
├── store/
│   └── orderSlice.ts           # Redux slice (mismo patrón que supplierSlice)
├── services.ts                 # Thin wrapper sobre OrderRepository
└── validation.ts               # Zod schema para Order + OrderItem
```

#### 7.4.2 Formulario de Ventas (OrderForm)

El formulario usa **React Hook Form + Zod** con `useFieldArray` para la lista dinámica de items:

```
┌─────────────────────────────────────────────┐
│  Cliente: [________________________]         │
│  (opcional, se autocompleta)                 │
├─────────────────────────────────────────────┤
│  ITEMS                        [Agregar item] │
│  ┌────────────────────────────────────────┐ │
│  │ Descripción: [Receta X]               │ │
│  │ Cant. [2]  Precio u. [8.50]   $17.00  │ │
│  │                              [🗑️]     │ │
│  ├────────────────────────────────────────┤ │
│  │ Descripción: [Menú Y]                 │ │
│  │ Cant. [1]  Precio u. [15.00]  $15.00  │ │
│  │                              [🗑️]     │ │
│  └────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  Subtotal:   [$32.00]  (auto-calculado)     │
│  Descuento:  [$0.00]                        │
│  Impuesto:   [$0.00]                        │
│  Total:      [$32.00]  (auto-calculado)     │
├─────────────────────────────────────────────┤
│  Método de pago: [Efectivo ▼]               │
│  Notas: [________________________]           │
│  Fecha: [31/05/2026 14:30]                  │
├─────────────────────────────────────────────┤
│                    [Cancelar] [Registrar]    │
└─────────────────────────────────────────────┘
```

**Comportamiento del formulario:**

1. **Items dinámicos**: `useFieldArray` permite agregar/eliminar filas de items con botón [+]
2. **Auto-cálculo**: cada item calcula `subtotal = quantity × unitPrice`; el total de orden = `subtotal - discount + tax`
3. **Subtotal y Total read-only**: se actualizan automáticamente via `useEffect` al cambiar items, descuento o impuesto
4. **Selección de cliente**: Select desplegable que lista todos los clientes registrados + opción "Cliente ocasional". Si el cliente no está listado, el usuario puede elegir "Escribir manualmente..." para ingresar el nombre como texto libre.
5. **Selección de recetas**: cada item tiene un Select de recetas arriba del campo de descripción. Al seleccionar una receta, se auto-completa la descripción con el nombre de la receta y el precio unitario con su `recommendedSalesPricePerPortion`. El usuario puede editar manualmente si la receta no existe.
6. **Carga inteligente**: al abrir el formulario, se cargan automáticamente los clientes desde Supabase y las recetas desde Redux (si no están ya cargadas en el store).
7. **Método de pago**: Select con opciones Efectivo/Tarjeta/Transferencia/Otro
8. **Fecha**: default a `now()`, editable en formato datetime-local

#### 7.4.3 OrderRepository

El repositorio maneja la relación 1:N entre `orders` y `order_items`:

```typescript
// createOrder inserta en orders + order_items
async function createOrder(order: OrderCreate): Promise<ApiResponse<Order>> {
  const { items, ...orderData } = order;

  // 1. Insertar la orden
  const { data, error } = await supabase.from('orders').insert({...}).select().single();

  // 2. Insertar items vinculados
  if (items.length > 0) {
    await supabase.from('order_items').insert(
      items.map(item => ({
        order_id: data.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      }))
    );
  }

  // 3. Retornar orden completa con items
  return getOrderById(data.id);
}
```

#### 7.4.4 Filtros por Estado

El `OrderList` incluye un filtro visual tipo "pills" con todos los estados:

| Botón | Filtro |
|-------|--------|
| Todas | Sin filtro |
| Pendiente | `status = 'PENDING'` |
| Confirmado | `status = 'CONFIRMED'` |
| Preparando | `status = 'PREPARING'` |
| Entregado | `status = 'DELIVERED'` |
| Cancelado | `status = 'CANCELLED'` |

#### 7.4.5 Orden de la lista

Las órdenes se muestran ordenadas por `order_date DESC` (más recientes primero).

### 7.5 Actualización de Inventario al Crear una Venta (Futuro)

Cuando se crea una orden/venta, el sistema debe:

```
1. Por cada OrderItem que tenga recipeId:
   a. Obtener los ingredientes de la receta (recipes_ingredients)
   b. Por cada ingrediente:
      - Calcular cantidad a descontar = cantidad_receta * cantidad_orden
      - Crear InventoryMovement con type = 'OUT'
      - Actualizar quantity en ingredients (stock -= cantidad_descontar)
      - Si stock < min_stock → disparar alerta
```

> **Nota:** La integración con inventario no está implementada en la V1. El formulario actual solo registra la venta sin descontar stock automáticamente. Los items se ingresan como descripciones de texto libre, no vinculados a recetas específicas.

---

## 8. Sistema de Temas

### 8.1 Arquitectura

```
CSS Custom Properties (variables CSS)
         │
         ▼
    ThemeProvider (React Context + Redux)
         │
         ├── Modo: 'light' | 'dark' | 'system'
         ├── Color primario: hex (#690375)
         └── Persistencia: Redux → localStorage → Supabase Config
```

### 8.2 Variables CSS

```css
/* src/styles/globals.css */

:root {
  /* Modo claro (default) */
  --color-primary: #690375;
  --color-primary-hover: #8a0499;
  --color-primary-light: #f0e6f2;
  
  --color-bg: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-card: #ffffff;
  
  --color-text: #1a1a2e;
  --color-text-secondary: #6c757d;
  
  --color-border: #e2e8f0;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

[data-theme="dark"] {
  --color-primary: #9b4dca;
  --color-primary-hover: #b066db;
  --color-primary-light: #2d1b3d;
  
  --color-bg: #0f0f23;
  --color-bg-secondary: #1a1a2e;
  --color-bg-card: #16213e;
  
  --color-text: #e2e8f0;
  --color-text-secondary: #a0aec0;
  
  --color-border: #2d3748;
}
```

### 8.3 Implementación

```typescript
// theme/ThemeProvider.tsx
function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, primaryColor } = useAppSelector(state => state.config);

  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar modo
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    // Aplicar color primario (se sobrescribe en :root dinámicamente)
    root.style.setProperty('--color-primary', primaryColor);
    
    // Generar variantes del color primario
    root.style.setProperty('--color-primary-hover', adjustColor(primaryColor, 20));
    root.style.setProperty('--color-primary-light', hexToRgba(primaryColor, 0.1));
  }, [theme, primaryColor]);

  return <>{children}</>;
}
```

---

## 9. Seguridad

### 9.1 Autenticación

- **Provider**: Supabase Auth (email/password + Google OAuth)
- **Persistencia**: Sesión guardada en `localStorage` con auto-refresh
- **Verificación de sesión**: `onAuthStateChange` listener en App.tsx
- **Protección de rutas**: `ProtectedRoute` component que verifica session válida en Supabase (no solo Redux)

### 9.2 Row Level Security (RLS)

- Todas las tablas tienen RLS habilitado
- Política única: `auth.uid() = user_id` para todas las operaciones
- Las consultas en frontend siempre filtran por `userId` como respaldo

### 9.3 Buenas Prácticas

- No almacenar secrets en frontend (las anon keys de Supabase son públicas por diseño)
- Validación Zod en frontend + validación secundaria en backend (RLS checks)
- Sanitización de inputs de texto (sin HTML injection en campos de texto)
- UUIDs no secuenciales como IDs (ya implementado con `gen_random_uuid()`)
- Rate limiting a nivel Supabase (configuración del proyecto)

---

## 10. Escalabilidad y Offline-First

### 10.1 Estrategia Offline-First (Futuro)

Para preparar la app para React Native y modo offline:

```
Capa de abstracción de datos:

┌─────────────────────────────────────────┐
│            Application                   │
│       (desconoce origen de datos)         │
└──────────────┬──────────────────────────┘
               │ Repository Interface
┌──────────────▼──────────────────────────┐
│         Data Layer Strategy              │
│                                          │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ SupabaseRepo │  │ LocalCacheRepo   │  │
│  │ (online)     │  │ (IndexedDB/SQLite)│  │
│  └─────────────┘  └──────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ SyncService (cuando vuelve online)│   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Para la V1** (sin offline), se implementa solo `SupabaseRepo`. La interfaz está diseñada para que en el futuro se pueda conectar un `LocalCacheRepo` sin cambiar el código de los módulos.

### 10.2 Preparación para React Native

1. **Separación de dependencias del browser**: `crypto.randomUUID()` → wrapper en `utils/id.ts`
2. **Componentes puramente React Native compatibles**: evitar APIs exclusivas del DOM
3. **Store Redux compartido**: la lógica de negocio en slices/services es 100% compartible
4. **Navegación**: React Router se reemplazaría por React Navigation, pero la config de rutas es similar
5. **UI**: Tailwind no funciona en RN sin NativeWind, los shared components se reescribirían con RN components

### 10.3 Performance

| Técnica | Dónde aplica |
|---------|-------------|
| `React.memo` | Cards en listas, ItemList components |
| `useMemo` | Cálculos de pricing, filtered lists |
| `useCallback` | Handlers pasados a child components |
| Paginación server-side | Ordenes, movimientos de inventario (cuando > 50 items) |
| Virtualización | Solo si listas > 200 items (React Window) |
| Lazy loading de módulos | `React.lazy()` para rutas pesadas |
| Debounce en búsquedas | SearchBar component |

---

## 11. Testing

### 11.1 Estrategia

| Tipo | Herramienta | Cobertura Objetivo |
|------|-----------|-------------------|
| **Unit tests** | Vitest | Services, adapters, validation schemas, pricing engine |
| **Component tests** | Vitest + RTL | Shared components, module components (Form, List) |
| **Integration tests** | Vitest + RTL | Page flows (crear receta → ver en lista) |
| **E2E** | Playwright (post-MVP) | Flujos críticos (login, CRUD recetas) |

### 11.2 Testing del Motor de Cálculo

```typescript
// services/__tests__/pricing.service.test.ts

describe('calculatePricing', () => {
  const baseConfig = { workHourlyRate: 10, profitMargin: 30, spendMargin: 10 };
  
  it('calcula costo de ingredientes correctamente', () => {
    const input = {
      ingredients: [
        { ingredientId: '1', quantity: 200, unitId: 'g', ingredientPrice: 5, ingredientBaseQty: 1000 },
      ],
      preparationTime: 0,
      portionsPerRecipe: 1,
      config: baseConfig,
    };
    
    const result = calculatePricing(input);
    // 200g de un ingrediente que cuesta $5/kg = $1.00
    expect(result.ingredientsCost).toBe(1.0);
  });
  
  it('aplica margen de gastos indirectos', () => {
    // ...
  });
  
  it('calcula mano de obra basado en tiempo de preparación', () => {
    // ...
  });
  
  it('calcula precio de venta recomendado correctamente', () => {
    // ...
  });
});
```

### 11.3 Testing de Componentes

```typescript
// shared/components/ui/__tests__/Button.test.tsx

describe('Button', () => {
  it('renderiza con texto', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });
  
  it('muestra loading spinner cuando loading=true', () => {
    render(<Button loading>Guardar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 12. DevOps y Deploy

### 12.1 Entorno de Desarrollo

```bash
# Iniciar
pnpm install
pnpm dev            # → localhost:5173

# Lint + Type Check
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit

# Tests
pnpm test           # vitest
pnpm test:coverage  # vitest --coverage

# Build
pnpm build          # → dist/
```

### 12.2 Deploy a Producción

**Opción recomendada: Vercel** (gratuito, integración nativa con Vite + SPA)

1. Conectar repo de GitHub
2. Framework preset: `Vite`
3. Build command: `pnpm build`
4. Output directory: `dist`
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Alternativa: Netlify** o **Cloudflare Pages**

### 12.3 CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

---

## 13. Plan de Migración JS → TypeScript

### 13.1 Estrategia

Migración progresiva por módulos, no todo a la vez:

| Fase | Módulos | Prioridad |
|------|---------|-----------|
| **Fase 1** | Infrastructure, types, adapters, shared components | Alta (sin estos no hay base) |
| **Fase 2** | Supplier, Auth, Config | Alta (módulos simples y rotos) |
| **Fase 3** | Ingredient, Recipe | Alta (core del negocio) |
| **Fase 4** | Menu, Customer, Order | Media (nuevos módulos) |
| **Fase 5** | Inventory, Expense, Dashboard | Media |
| **Fase 6** | Limpieza de .js → .tsx, eliminar archivos legacy | Baja |

### 13.2 Pasos por Módulo

Para cada archivo `.js` → `.tsx`:

1. Renombrar a `.ts` o `.tsx`
2. Agregar tipos a props (`interface Props { ... }`)
3. Agregar tipos a funciones y variables
4. Reemplazar `Yup` → `Zod`
5. Reemplazar `moment` → `dayjs`
6. Reemplazar `uuid` → `crypto.randomUUID()`
7. Verificar con `tsc --noEmit` que no haya errores

### 13.3 Archivos a Crear (TypeScript)

```
tsconfig.json
src/types/models.ts
src/types/api.ts
src/types/forms.ts
src/types/common.ts
src/types/supabase.ts              # Generado con supabase gen types
```

### 13.4 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 14. Roadmap Post-spec

### 14.1 Orden de Implementación Recomendado

```
Fase 0: Infraestructura base (1-2 días)
  ├── TypeScript setup (tsconfig.json, tipos base)
  ├── Dependencias nuevas (RHF, Zod, dayjs, toast)
  ├── ThemeProvider + CSS variables
  ├── BaseRepository + interfaces
  └── Shared components (Button, Input, Modal, etc.)

Fase 1: Auth + Config + Supplier (2-3 días)
  ├── Migrar Auth a TS + fix AuthCallback bug
  ├── Reconstruir Config (funcional + persistente + temas)
  └── Migrar Supplier (es el reference, queda como template)

Fase 2: Ingredient + Inventory (2-3 días)
  ├── Migrar Ingredient (fix adapter, naming, types)
  ├── Crear InventoryMovements
  └── Sistema de alertas de stock mínimo

Fase 3: Recipe + Pricing Engine (3-4 días)
  ├── Motor de cálculo de precios
  ├── Refactor Recipe (eliminar reload, fix error handling)
  ├── RecipeVersionHistory
  ├── Image upload
  └── Export PDF

Fase 4: Menus + Customers + Orders (3-4 días)
  ├── Módulos nuevos desde cero
  ├── Integración con inventario (descontar stock al vender)
  └── Dashboard de ventas

Fase 5: Dashboard + Reportes (2-3 días)
  ├── Dashboard principal con stats
  ├── Reporte de márgenes
  ├── Ranking de ingredientes
  └── Ganancias vs gastos

Fase 6: Testing + Pulido (3-4 días)
  ├── Tests unitarios del pricing engine
  ├── Tests de componentes compartidos
  ├── Tests de módulos críticos
  └── QA manual + bug fixes

Fase 7: Deploy + CI/CD (1 día)
  ├── Configurar Vercel/Netlify
  ├── GitHub Actions CI
  └── Variables de entorno en producción

Fase 8: Post-MVP (futuro)
  ├── Modo offline (IndexedDB + SyncService)
  ├── App React Native
  ├── Facturación electrónica
  ├── Integración con pasarela de pagos
  └── Marketplace de recetas
```

---

## Apéndice A: Glosario

| Término | Definición |
|---------|-----------|
| **Spec-Driven Development** | Metodología donde el spec es el artefacto principal antes de escribir código |
| **Vertical Slice** | Módulo que abarca desde la UI hasta la base de datos, autocontenido |
| **RLS** | Row Level Security — políticas de seguridad a nivel de fila en PostgreSQL |
| **Offline-First** | Arquitectura donde la app funciona sin conexión y sincroniza cuando vuelve |
| **Design Token** | Variable de diseño (color, spacing, tipografía) usada consistentemente |
| **Domain Model** | Representación de las entidades del negocio con sus reglas y relaciones |

---

## Apéndice B: Convenciones de Estilo

### B.1 Nombres de Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes React | `PascalCase.tsx` | `SupplierCard.tsx` |
| Hooks | `camelCase.ts` | `useModal.ts` |
| Servicios | `camelCase.ts` | `pricing.service.ts` |
| Slices | `camelCase.ts` | `supplierSlice.ts` |
| Adaptadores | `camelCase.ts` | `supplier.adapter.ts` |
| Validación | `camelCase.ts` | `validation.ts` |
| Tipos | `camelCase.ts` | `types.ts` |

### B.2 Nombres de Variables

| Contexto | Convención | Ejemplo |
|----------|-----------|---------|
| Variables locales | camelCase | `isLoading`, `selectedItem` |
| Constantes | UPPER_SNAKE | `MAX_FILE_SIZE` |
| Interfaces | PascalCase | `Supplier`, `PricingInput` |
| Types | PascalCase | `ApiResponse<T>` |
| Enums | PascalCase | `OrderStatus` |
| Funciones | camelCase | `calculatePricing()` |
| Componentes | PascalCase | `function SupplierCard()` |

### B.3 Estilo de Código

| Regla | Estándar |
|-------|---------|
| Indentación | 2 espacios |
| Comillas | `"double"` para JSX y strings |
| Semicolons | Siempre |
| Línea máxima | 100 caracteres |
| Export default | Solo para páginas y componentes principales |
| Named exports | Para slices, adapters, services, types |

---

> **Fin del Documento de Especificación — LaCocinita v1.0.0**
>
> Este spec es el contrato de diseño. Cualquier cambio debe pasar por revisión del arquitecto y actualización de este documento.
