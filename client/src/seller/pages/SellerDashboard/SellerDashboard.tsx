import SellerRoutes from "../../../routes/SellerRoutes";
import Navbar from "../../../admin seller/components/navbar/Navbar";
import SellerDrawerList from "../../components/SideBar/DrawerList";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import { Alert, Collapse } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BlockIcon from "@mui/icons-material/Block";

const SellerDashboard = () => {
  const { sellers } = useAppSelector((store) => store);
  const status = sellers.profile?.accountStatus;

  const getStatusBanner = () => {
    if (status === "PENDING_VERIFICATION") {
      return (
        <Alert
          icon={<HourglassEmptyIcon />}
          severity="warning"
          sx={{ borderRadius: 0, fontWeight: 500 }}
        >
          🔍 Your account is under verification. Our team is reviewing your PAN and business details — usually takes 1–2 business days. You can still set up your store in the meantime.
        </Alert>
      );
    }
    if (status === "SUSPENDED") {
      return (
        <Alert icon={<BlockIcon />} severity="error" sx={{ borderRadius: 0, fontWeight: 500 }}>
          ⚠️ Your account has been suspended. Please contact support for assistance.
        </Alert>
      );
    }
    if (status === "ACTIVE") {
      return (
        <Alert
          icon={<VerifiedIcon />}
          severity="success"
          sx={{ borderRadius: 0, fontWeight: 500 }}
        >
          ✅ Your account is verified and active. Happy selling!
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <Navbar DrawerList={SellerDrawerList} />

      {/* Account status banner */}
      <Collapse in={!!status && status !== "PENDING_ONBOARDING"}>
        {getStatusBanner()}
      </Collapse>

      <section className="lg:flex lg:h-[90vh]">
        <div className="hidden lg:block h-full">
          <SellerDrawerList />
        </div>
        <div className="p-6 lg:p-10 w-full lg:w-[80%] overflow-y-auto">
          <SellerRoutes />
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
