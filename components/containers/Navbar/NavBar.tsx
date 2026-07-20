"use client";

import DesktopNav from "./DesktopNav";
// import Logo from "@/components/containers/Logo";
// import NavItems from "@/components/containers/Navbar/NavItems";

const NavBar = () => {
  return (
    <nav className="flex md:items-center justify-between px-8   max-xl:hidden ">
      <div>
    <DesktopNav />
        {/* <Logo /> */}
      </div>
      {/* <NavItems /> */}
    </nav>
  );
};

export default NavBar;
