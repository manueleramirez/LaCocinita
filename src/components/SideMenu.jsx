import { useState } from "react";
import routesConfig from "../routesConfig";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { IoExit } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { logout } from "../modules/Security/slice";

export default function SideMenu() {
  const dispatcher = useDispatch();
  const navigate = useNavigate()
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const handleSignOut = () =>{
    dispatcher(logout())
    navigate('/')
  }
  return (
    <>
      <button
        title="Side navigation"
        type="button"
        className={`visible fixed left-6 top-6 z-40 order-10 block h-10 w-10 self-center rounded bg-white opacity-100 lg:hidden ${
          isSideNavOpen
            ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(3)]:w-0 [&_span:nth-child(2)]:-rotate-45 "
            : ""
        }`}
        aria-haspopup="menu"
        aria-label="Side navigation"
        aria-expanded={isSideNavOpen ? " true" : "false"}
        aria-controls="nav-menu-1"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
      >
        <div className="absolute top-1/2 left-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-700 transition-all duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
          ></span>
        </div>
      </button>

      {/*  <!-- Side Navigation --> */}
      <aside
        id="nav-menu-1"
        aria-label="Side navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-r-slate-200 bg-slate-50 transition-transform lg:translate-x-0 ${
          isSideNavOpen ? "translate-x-0" : " -translate-x-full"
        }`}
      >
        <Link
          aria-label="WindUI logo"
          className="flex items-center gap-2 whitespace-nowrap p-6 text-xl font-medium focus:outline-none"
          href="#"
        >
          <Logo/>
          <p className="text-primary font-bold text-2xl italic">LaCocinita</p>
        </Link>
        <nav
          aria-label="side navigation"
          className="flex-1 divide-y divide-slate-100 overflow-auto"
        >
          <div>
            <ul className="flex flex-1 flex-col gap-1 py-3">
              {routesConfig.map((route) =>
                route.showInMenu ? (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      onClick={()=>setIsSideNavOpen(false)}
                      className=" ml-4 flex items-center gap-3 rounded p-3 text-slate-700 transition-colors hover:bg-purple-50 hover:text-primary focus:bg-purple-50 aria-[current=page]:bg-purple-50 aria-[current=page]:text-primary"
                    >
                      <div className="flex items-center self-center text-2xl text-primary">
                        {route.icon}
                      </div>
                      <span className="text-base font-medium">
                        {route.label}
                      </span>
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </div>

          <div className="w-full h-4 absolute bottom-8">
            <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 rounded p-3 pl-7 text-slate-700 transition-colors hover:bg-primary hover:text-white focus:bg-purple-50 aria-[current=page]:bg-purple-50 aria-[current=page]:text-primary"
                    >
                      <div className="flex items-center self-center text-2xl">
                        {<IoExit/>}
                      </div>
                      <span className="text-base font-medium">
                        {'Salir'}
                      </span>
                    </button>
          </div>
        </nav>
      </aside>

      {/*  <!-- Backdrop --> */}
      <div
        className={`fixed top-0 bottom-0 left-0 right-0 z-30 bg-slate-900/20 transition-colors lg:hidden ${
          isSideNavOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSideNavOpen(false)}
      ></div>
      {/*  <!-- End Basic side navigation menu --> */}
    </>
  );
}
