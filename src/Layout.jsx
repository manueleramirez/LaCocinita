import Logo from "./components/Logo";
import SideMenu from "./components/SideMenu";

export default function Layout({ children }) {
  // const {NotificationComponent} = useNotification() 
  return (
    <div className="bg-slate-100 flex flex-col min-h-screen">
      {/* Header móvil */}
      <div className="fixed top-0 left-0 right-0 z-30 flex w-full justify-center items-center py-4 bg-white shadow-sm lg:hidden">
        <Logo/>
        <p className="text-primary font-bold text-xl italic ml-2">LaCocinita</p>
      </div>
      
      <SideMenu />
      
      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Espacio para el sidebar en desktop */}
        <div className="hidden lg:block lg:w-72"></div>
        
        {/* Contenido */}
        <div className="flex-1 w-full lg:pl-0 pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}