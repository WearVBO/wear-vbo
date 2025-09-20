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
    <div className='lg:hidden   '>
        <div className='mx-auto dark:bg-white'>
        <div className='items-center justify-between flex px-3 py-2 '>
            <Logo />
            <Sheet>
                <SheetTrigger className="text-2xl" >
                <CiMenuFries suppressHydrationWarning className='dark:text-black -px-5'/>
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
