"use client"
import React from 'react'
import { CiMenuFries } from "react-icons/ci";
import Logo from "@/components/Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavItems from '@/components/NavItems';

const Header = () => {
  return (
    <div className='2xl:hidden    '>
        <div className='mx-auto'>
        <div className='items-center justify-between flex dark:bg-white'>
            <Logo />
            <Sheet>
                <SheetTrigger className="text-2xl" >
                <CiMenuFries suppressHydrationWarning className='dark:text-black -p-2'/>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] bg-white border-0 flex flex-col items-center dark:text-black">
                <SheetHeader className='flex justify-between dark:text-black'>
                    <SheetTitle > 
                        <Logo  />
                    </SheetTitle>
                    <SheetDescription className='hidden'>
                    Explore our features and offerings.
                    </SheetDescription>
                </SheetHeader>
              <NavItems />
                </SheetContent>
            </Sheet>
        </div>
        </div>
      
    </div>
  )
}

export default Header
