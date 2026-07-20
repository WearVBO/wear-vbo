"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
// import {useSearchParams} from "next/navigation";

const categories = [
  { name: "Women", tag: "female", subcategories: ["Tops", "Bottoms"] },
  { name: "Men", tag: "male", subcategories: ["Shirts", "Shorts"] },
  { name: "Unisex", tag: "unisex", subcategories: ["Hoodies", "Sweatshirts"] },
];

const colors = ["green", "red", "yellow", "orange", "blue", "purple", "pink", "white", "black"];
const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedColors: string[];
  selectedSizes: string[];
  onCategoryChange: (category: string) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedColors,
  selectedSizes,
  onCategoryChange,
  onColorChange,
  onSizeChange,
}: SidebarProps) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [showColors, setShowColors] = useState(true);
  const [showSizes, setShowSizes] = useState(true);

  const handleClearAll = () => {
    onCategoryChange("");
    selectedColors.forEach(color=> onColorChange(color));
    selectedSizes.forEach(size => onSizeChange(size))
  }
// const searchParams = useSearchParams();
// const categoryParam = searchParams?.get("category");
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">
        <SidebarContent
          selectedCategory={selectedCategory}
          selectedColors={selectedColors}
          selectedSizes={selectedSizes}
          onCategoryChange={onCategoryChange}
          onColorChange={onColorChange}
          onSizeChange={onSizeChange}
          openCategory={openCategory}
          setOpenCategory={setOpenCategory}
          showColors={showColors}
          setShowColors={setShowColors}
          showSizes={showSizes}
          setShowSizes={setShowSizes}
        />
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-72 h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm uppercase tracking-widest">Filters</h3>
              <button onClick={onClose}><IoClose size={20} /></button>
            </div>
            <SidebarContent
              selectedCategory={selectedCategory}
              selectedColors={selectedColors}
              selectedSizes={selectedSizes}
              onCategoryChange={onCategoryChange}
              onColorChange={onColorChange}
              onSizeChange={onSizeChange}
              openCategory={openCategory}
              setOpenCategory={setOpenCategory}
              showColors={showColors}
              setShowColors={setShowColors}
              showSizes={showSizes}
              setShowSizes={setShowSizes}
            />
          </div>
          <div className="flex-1 bg-black/40" onClick={onClose} />
        </div>
      )}
    </>
  );
};

interface SidebarContentProps {
  selectedCategory: string;
  selectedColors: string[];
  selectedSizes: string[];
  onCategoryChange: (category: string) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  openCategory: string | null;
  setOpenCategory: (category: string | null) => void;
  showColors: boolean;
  setShowColors: (show: boolean) => void;
  showSizes: boolean;
  setShowSizes: (show: boolean) => void;
}

const SidebarContent = ({
  selectedCategory,
  selectedColors,
  selectedSizes,
  onCategoryChange,
  onColorChange,
  onSizeChange,
  openCategory,
  setOpenCategory,
  showColors,
  setShowColors,
  showSizes,
  setShowSizes,
}: SidebarContentProps) => {
  return (
    
    
    
    <div className="flex flex-col gap-4">
      {/* header */}
       <div className="flex items-center justify-between">
    <h3 className="font-bold text-sm uppercase tracking-widest">Filters</h3>
    {(selectedCategory || selectedColors.length > 0 || selectedSizes.length > 0) && (
      <button
        onClick={() => {
          onCategoryChange("");
          [...selectedColors].forEach(color => onColorChange(color));
          [...selectedSizes].forEach(size => onSizeChange(size));
        }}
        className="text-xs text-red-500 hover:underline"
      >
        Clear all
      </button>
    )}
  </div>

  
      {/* Category */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`text-left text-sm py-1 ${selectedCategory === "" ? "font-bold text-black" : "text-gray-500 hover:text-black"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <div key={cat.name}>
              <button
                onClick={() => {
                  onCategoryChange(cat.tag);
                  setOpenCategory(openCategory === cat.name ? null : cat.name);
                }}
                className={`w-full text-left text-sm py-1 flex items-center justify-between ${selectedCategory === cat.tag ? "font-bold text-black" : "text-gray-500 hover:text-black"}`}
              >
                {cat.name}
                <span>{openCategory === cat.name ? "−" : "+"}</span>
              </button>
              {openCategory === cat.name && (
                <div className="pl-4 flex flex-col gap-1 mt-1">
                  {cat.subcategories.map((sub: string) => (
                    <span key={sub} className="text-xs text-gray-400">{sub}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* Colors */}
      <div>
        <button
          onClick={() => setShowColors(!showColors)}
          className="w-full flex items-center justify-between font-bold text-sm uppercase tracking-widest mb-3"
        >
          Colors
          <span>{showColors ? "−" : "+"}</span>
        </button>
        {showColors && (
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-7 h-7 rounded-full border-2 ${selectedColors.includes(color) ? "border-black" : "border-transparent"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Sizes */}
      <div>
        <button
          onClick={() => setShowSizes(!showSizes)}
          className="w-full flex items-center justify-between font-bold text-sm uppercase tracking-widest mb-3"
        >
          Size
          <span>{showSizes ? "−" : "+"}</span>
        </button>
        {showSizes && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-3 py-1 rounded-full text-xs border ${selectedSizes.includes(size) ? "bg-black text-white border-black" : "bg-gray-100 border-transparent"}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;