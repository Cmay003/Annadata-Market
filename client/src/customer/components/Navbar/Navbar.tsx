


import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerList from "./DrawerList";
import CategorySheet from "./CategorySheet";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { FavoriteBorder } from "@mui/icons-material";
import { mainCategory } from "../../../data/category/mainCategory";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  // const { products, } = useAppSelector(
  //   (state) => state.products
  // );

  
  const { i18n } = useTranslation();

  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cart = useAppSelector((store: any) => store.cart);
  const sellers = useAppSelector((store: any) => store.sellers);
  const user = useAppSelector((store: any) => store.user);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const becomeSellerClick = () => {
    if (sellers.profile?.id) {
      navigate("/seller");
    } else {
      navigate("/become-seller");
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <Box className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="flex items-center justify-between px-3 lg:px-10 h-[70px]">

        {/* LEFT */}
        <div className="flex items-center gap-3 lg:gap-6">

          {!isLarge && (
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-2"
          >
            <img src="/logo2.png" alt="logo" className="w-8 h-8" />
            {!isMobile && (
              <h1 className="text-lg font-bold text-[#00927c] whitespace-nowrap">
                Annadata Market
              </h1>
            )}
          </div>

          {/* CATEGORY (DESKTOP ONLY) */}
          {isLarge && (
            <ul className="flex items-center font-medium text-gray-800 relative">
              {mainCategory.map((item) => (
                <li
                  key={item.categoryId}
                  className="relative cursor-pointer px-3 h-[70px] flex items-center hover:text-[#00927c]"
                  onMouseEnter={() => {
                    setSelectedCategory(item.categoryId);
                    setShowSheet(true);
                  }}
                  onMouseLeave={() => setShowSheet(false)}
                
                >
                  {item.name}

                  {showSheet && selectedCategory === item.categoryId && (
                    <div
                      onMouseEnter={() => setShowSheet(true)}
                      onMouseLeave={() => setShowSheet(false)}
                      className="
              absolute 
              top-full 
              left-0 
              mt-2 
              z-50 
              bg-white 
              shadow-xl 
              rounded-lg 
              p-4 
              w-[600px]
            "
                    >

                      
                        
                          <CategorySheet
            
                          
                            selectedCategory={selectedCategory}
                            setShowSheet={setShowSheet}
                          />
            


                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 lg:gap-4">

          {/* SEARCH */}
          <IconButton onClick={() => navigate("/search-products")}>
            <SearchIcon />
          </IconButton>

          {/* USER */}
          {user.user ? (
            <Button onClick={() => navigate("/account/orders")}>
              <Avatar
                sx={{ width: 28, height: 28 }}
                src="https://cdn.pixabay.com/photo/2015/04/15/09/28/head-723540_640.jpg"
              />
              {!isMobile && (
                <span className="ml-2">
                  {user.user?.fullName?.split(" ")[0]}
                </span>
              )}
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")}>
              <AccountCircleIcon />
              {!isMobile && "Login"}
            </Button>
          )}

          {/* WISHLIST (hide on mobile) */}
          {!isMobile && (
            <IconButton onClick={() => navigate("/wishlist")}>
              <FavoriteBorder />
            </IconButton>
          )}

          {/* CART */}
          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={cart.cart?.cartItems?.length || 0}>
              <AddShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* SELLER (hide on mobile) */}
          {isLarge && (
            <Button onClick={becomeSellerClick}>
              <StorefrontIcon /> Seller
            </Button>
          )}

          {/* 🌍 LANGUAGE SWITCH */}
          <div className="flex items-center border rounded-md overflow-hidden text-xs ml-2">
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-1 ${i18n.language === "en"
                ? "bg-green-600 text-white"
                : "bg-white"
                }`}
            >
              EN
            </button>

            <button
              onClick={() => changeLanguage("hi")}
              className={`px-2 py-1 ${i18n.language === "hi"
                ? "bg-green-600 text-white"
                : "bg-white"
                }`}
            >
              HI
            </button>
          </div>

        </div>
      </div>

      {/* DRAWER */}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </Box>
  );
};

export default Navbar;