"use client";
import Logo from "@/components/Logo";
import NavItems from "@/components/NavItems";

const NavBar = () => {
  return (
    <nav className="flex md:items-center justify-between max-xl:hidden ">
      <div>
        <Logo />
        
      </div>
      <NavItems />
    </nav>
  );
};

export default NavBar;
