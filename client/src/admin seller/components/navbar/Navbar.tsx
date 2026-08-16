// // import React from 'react'
// // import MenuIcon from '@mui/icons-material/Menu';
// // import { Drawer, IconButton } from '@mui/material';
// // import { useNavigate } from 'react-router-dom';

// // const Navbar = ({DrawerList}:any) => {
// //   const navigate = useNavigate()
// //   const [open, setOpen] = React.useState(false);

// //   const toggleDrawer = (newOpen: any)=>() => {
// //     setOpen(newOpen);
    
// //   };

// //   return (
// //     <div className='h-[10vh] flex items-center px-5 border-b'>
// //       <div className='flex items-center gap-3 '>
// //         <IconButton onClick={toggleDrawer(true)} color='primary'>
// //           <MenuIcon color='primary' />
// //         </IconButton>

// //         <h1 onClick={() => navigate("/")} className='logo text-xl cursor-pointer'>Annadata Market</h1>
// //       </div>

// //       <Drawer open={open} onClose={toggleDrawer(false)}>
// //         <DrawerList toggleDrawer={toggleDrawer} />
// //       </Drawer>

// //     </div>
// //   )
// // }

// // export default Navbar

// import React from "react";
// import MenuIcon from "@mui/icons-material/Menu";
// import { Drawer, IconButton, useMediaQuery } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const Navbar = ({ DrawerList }: any) => {

//   const { i18n } = useTranslation();
//   const navigate = useNavigate();
//   const [open, setOpen] = React.useState(false);

//   const isMobile = useMediaQuery("(max-width:768px)"); // ✅ ADD THIS

//   const toggleDrawer = (newOpen: boolean) => () => {
//     setOpen(newOpen);
//   };


//   const changeLanguage = (lang: string) => {
//   i18n.changeLanguage(lang);
// };
//   return (
//     <div className="h-[10vh] flex items-center px-5 border-b justify-between">

//       <div className="flex items-center gap-3">

//         {/* ✅ ONLY MOBILE */}
//         {isMobile && (
//           <IconButton onClick={toggleDrawer(true)} color="primary">
//             <MenuIcon />
//           </IconButton>
//         )}

//         <h1
//           onClick={() => navigate("")}
//           className="logo text-xl cursor-pointer"
//         >
//           Annadata Market
//         </h1>
//       </div>

      

//       {/* Drawer */}
//       <Drawer open={open} onClose={toggleDrawer(false)}>
//         <DrawerList toggleDrawer={toggleDrawer} />
//       </Drawer>
//     </div>
//   );
// };

// export default Navbar;

import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ ADD

const Navbar = ({ DrawerList }: any) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  const { i18n } = useTranslation(); // ✅ ADD

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className="h-[10vh] flex items-center px-5 border-b justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {isMobile && (
          <IconButton onClick={toggleDrawer(true)} color="primary">
            <MenuIcon />
          </IconButton>
        )}

        <h1
          onClick={() => navigate("")}
          className="logo text-xl cursor-pointer"
        >
          Annadata Market
        </h1>
      </div>

      {/* RIGHT - LANGUAGE SWITCH */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => changeLanguage("en")}
          className={`px-3 py-1 rounded ${
            i18n.language === "en"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          EN
        </button>

        <button
          onClick={() => changeLanguage("hi")}
          className={`px-3 py-1 rounded ${
            i18n.language === "hi"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          HI
        </button>
      </div>

      {/* DRAWER */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  );
};

export default Navbar;