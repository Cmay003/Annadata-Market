// // import * as React from "react";
// import DrawerList from "../../../admin seller/components/drawerList/DrawerList";
// import { AccountBox } from "@mui/icons-material";
// import LogoutIcon from '@mui/icons-material/Logout';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ReceiptIcon from '@mui/icons-material/Receipt';
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import AddIcon from '@mui/icons-material/Add';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';


// const menu = [
//   {
//     name: "Dashboard",
//     path: "/seller",
//     icon: <DashboardIcon className="text-primary-color" />,
//     activeIcon: <DashboardIcon className="text-white" />,
//   },
//   {
//     name: "Orders",
//     path: "/seller/orders",
//     icon: <ShoppingBagIcon className="text-primary-color" />,
//     activeIcon: <ShoppingBagIcon className="text-white" />,
//   },
//   {
//     name: "Products",
//     path: "/seller/products",
//     icon: <InventoryIcon className="text-primary-color" />,
//     activeIcon: <InventoryIcon className="text-white" />,
//   },
//   {
//     name: "Add Product",
//     path: "/seller/add-product",
//     icon: <AddIcon className="text-primary-color" />,
//     activeIcon: <AddIcon className="text-white" />,
//   },
//   {
//     name: "Payment",
//     path: "/seller/payment",
//     icon: <AccountBalanceWalletIcon className="text-primary-color" />,
//     activeIcon: <AccountBalanceWalletIcon className="text-white" />,
//   },
//   {
//     name: "Transaction",
//     path: "/seller/transaction",
//     icon: <ReceiptIcon className="text-primary-color" />,
//     activeIcon: <ReceiptIcon className="text-white" />,
//   },
//   // {
//   //   name: "Inventory",
//   //   path: "/seller/inventory",
//   //   icon: <MailIcon className="text-primary-color" />,
//   //   activeIcon: <MailIcon className="text-white" />,
//   // },
// ];

// const menu2 = [
  
//   {
//     name: "Account",
//     path: "/seller/account",
//     icon: <AccountBox className="text-primary-color" />,
//     activeIcon: <AccountBox className="text-white" />,
//   },
//   {
//     name: "Logout",
//     path: "/",
//     icon: <LogoutIcon className="text-primary-color" />,
//     activeIcon: <LogoutIcon className="text-white" />,
//   },
// ];

// interface DrawerListProps {
//   toggleDrawer?: any;
// }

// const SellerDrawerList = ({ toggleDrawer }: DrawerListProps) => {
//   return <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />;
// };

// export default SellerDrawerList;


import DrawerList from "../../../admin seller/components/drawerList/DrawerList";
import { AccountBox } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useTranslation } from "react-i18next";
import { PercentIcon } from "lucide-react";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { resetSellerProfile } from "../../../Redux Toolkit/Seller/sellerSlice";
import { resetSellerAuthState } from "../../../Redux Toolkit/Seller/sellerAuthenticationSlice";
import { useNavigate } from "react-router-dom";

interface DrawerListProps {
  toggleDrawer?: any;
}

const SellerDrawerList = ({ toggleDrawer }: DrawerListProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSellerLogout = () => {
    localStorage.removeItem("seller_jwt");
    dispatch(resetSellerProfile());
    dispatch(resetSellerAuthState());
    navigate("/");
  };

  const menu = [
    {
      name: t("dashboard"),
      path: "/seller",
      icon: <DashboardIcon className="text-primary-color" />,
      activeIcon: <DashboardIcon className="text-white" />,
    },
    {
      name: t("orders"),
      path: "/seller/orders",
      icon: <ShoppingBagIcon className="text-primary-color" />,
      activeIcon: <ShoppingBagIcon className="text-white" />,
    },
    {
      name: t("products"),
      path: "/seller/products",
      icon: <InventoryIcon className="text-primary-color" />,
      activeIcon: <InventoryIcon className="text-white" />,
    },
    {
      name: t("addProduct"),
      path: "/seller/add-product",
      icon: <AddIcon className="text-primary-color" />,
      activeIcon: <AddIcon className="text-white" />,
    },
    {
      name: t("payment"),
      path: "/seller/payment",
      icon: <AccountBalanceWalletIcon className="text-primary-color" />,
      activeIcon: <AccountBalanceWalletIcon className="text-white" />,
    },
    {
      name: t("transaction"),
      path: "/seller/transaction",
      icon: <ReceiptIcon className="text-primary-color" />,
      activeIcon: <ReceiptIcon className="text-white" />,
    },
{
  name: "Commission",
  path: "/seller/commission",
  icon: <PercentIcon className="text-primary-color" />,
  activeIcon: <PercentIcon className="text-white" />,
},
    
  ];

  const menu2 = [
    {
      name: t("account"),
      path: "/seller/account",
      icon: <AccountBox className="text-primary-color" />,
      activeIcon: <AccountBox className="text-white" />,
    },
    {
      name: t("logout"),
      path: "/",
      icon: <LogoutIcon className="text-primary-color" />,
      activeIcon: <LogoutIcon className="text-white" />,
    },
  ];

  return <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} onLogout={handleSellerLogout} />;
};

export default SellerDrawerList;