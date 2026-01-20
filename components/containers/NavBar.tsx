"use client";
import Logo from "@/components/containers/Logo";
import NavItems from "@/components/containers/NavItems";

const NavBar = () => {
  return (
    <nav className="flex md:items-center justify-between px-8   max-xl:hidden ">
      <div>
        <Logo />
      </div>
      <NavItems />
    </nav>
  );
};

export default NavBar;
