import Logo from "./components/Logo";
import SideMenu from "./components/SideMenu";

export default function Layout({ children }) {
  // const {NotificationComponent} = useNotification() 
  return (
    <div className="bg-slate-100 flex flex-col">
      <div className="fixed flex w-full justify-center items-center pt-6 lg:hidden"><Logo/><p className="text-primary font-bold text-2xl italic ml-2">LaCocinita</p></div>
      <SideMenu />
      <div className="h-screen w-screen overflow-hidden flex justify-center lg:pl-24">
        {children}
      </div>
    </div>
  );
}