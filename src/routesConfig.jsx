import { IoCart, IoCog, IoListCircleSharp, IoReceiptOutline} from "react-icons/io5";
import Supplier from "./modules/Supplier/Supplier";
import Ingredient from "./modules/Ingredients/Ingredient";
import Recipe from "./modules/Recipe/Recipe";
import SignIn from "./modules/Security/Login";

const routesConfig = [
    {
      path: "/",
      label: "",
      element:<SignIn/>,
      showInMenu: false,
      isProtected: false,
      
    },
    {
      path: "/recipes",
      label: "Recetas",
      element: <Recipe/>,
      showInMenu: true,
      isProtected: true,
      icon: <IoReceiptOutline/>
    },
    {
      path: "/suppliers",
      label: "Suplidores",
      element: <Supplier/>,
      showInMenu: true,
      isProtected: true,
      icon: <IoCart/>
    },
    {
      path: "/Ingredient",
      label: "Ingredientes",
      element: <Ingredient/>,
      showInMenu: true,
      isProtected: true,
      icon: <IoListCircleSharp/>
    },
    {
      path: "/config",
      label: "Configuraciones",
      element: <Ingredient/>,
      showInMenu: true,
      isProtected: true,
      icon: <IoCog/>
    },

  ];
  
  export default routesConfig;
  