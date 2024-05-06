'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import {useEffect, useState} from "react";
import Footer from "@/components/layout/Footer";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [open, setOpen] = useState(0);
  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories))
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
    });
  }, []);
  return (
    <>
    <section className="flex flex-col gap-4 py-2">
      <div className="grid grid-cols-4 gap-2 pb-1 sticky top-0 z-50 bg-white shadow-[0_5px_5px_-5px_rgba(0,0,0,0.1)]">
        {categories?.length > 0 && categories.map((c, index) => (
          <a key={index} onClick={() => handleTabOpen(index)}
            className={`cursor-pointer text-center rounded-lg max-w-auto p-4 text-sm ${
            open === index ? "bg-primary text-white" : "text-body-color hover:bg-primary hover:text-white"}`}>
              {c.name}
          </a>
        ))}
      </div>
      {categories?.length > 0 && categories.map((c, index) => (
        <div key={index} className={`grid grid-cols-5 gap-1 ${open === index ? "block" : "hidden"} `}>
          {menuItems.filter(item => item.category._id === c._id).map(item => (
            <MenuItem key={item._id} {...item} />
         ))}
        </div>
      ))} 
    </section>
    <Footer />
    </>
  )
};