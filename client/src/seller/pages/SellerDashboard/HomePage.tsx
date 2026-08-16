import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchSellerReport } from "../../../Redux Toolkit/Seller/sellerSlice";
import SellingChart from "./SellingChart";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelIcon from "@mui/icons-material/Cancel";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number | undefined;
  color: string;
  bgColor: string;
  suffix?: string;
}

const StatCard = ({ icon, title, value, color, bgColor, suffix = "" }: StatCardProps) => (
  <div
    className="rounded-2xl p-6 flex items-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    style={{ background: bgColor }}
  >
    <div
      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: color + "22", color }}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {suffix}{value ?? "—"}
      </p>
    </div>
  </div>
);

const statusLabel: Record<string, { label: string; color: "default" | "warning" | "success" | "error" }> = {
  PENDING_ONBOARDING: { label: "Onboarding", color: "default" },
  PENDING_VERIFICATION: { label: "Under Review", color: "warning" },
  ACTIVE: { label: "Active", color: "success" },
  SUSPENDED: { label: "Suspended", color: "error" },
  BANNED: { label: "Banned", color: "error" },
};

const HomePage = () => {
  const { t } = useTranslation();
  const { sellers } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const Chart = [
    { name: t("today") || "Today", value: "today" },
    { name: t("daily") || "Last 7 Days", value: "daily" },
    { name: t("monthly") || "Last 12 Months", value: "monthly" },
  ];

  const [chartType, setChartType] = React.useState(Chart[0].value);

  useEffect(() => {
    dispatch(fetchSellerReport(localStorage.getItem("seller_jwt") || ""));
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value as string);
  };

  const profile = sellers.profile;
  const report = sellers.report;
  const accountStatus = profile?.accountStatus || "PENDING_ONBOARDING";
  const statusInfo = statusLabel[accountStatus] || { label: accountStatus, color: "default" };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
            <StorefrontIcon className="text-white" fontSize="large" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {profile?.sellerName || "Seller"} 👋
            </h1>
            <p className="text-gray-500 text-sm">
              {profile?.businessDetails?.businessName || "Your Store"} &bull; {profile?.email}
            </p>
          </div>
        </div>
        <Chip
          label={statusInfo.label}
          color={statusInfo.color}
          variant="outlined"
          sx={{ fontWeight: 600, px: 1 }}
        />
      </div>

      {/* Stats Grid */}
      {sellers.loading && !report ? (
        <div className="flex justify-center py-12">
          <CircularProgress size={40} sx={{ color: "#059669" }} />
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<CurrencyRupeeIcon />}
            title={t("total_earnings") || "Total Earnings"}
            value={report?.totalEarnings?.toLocaleString("en-IN") ?? "0"}
            suffix="₹"
            color="#059669"
            bgColor="#f0fdf4"
          />
          <StatCard
            icon={<ShoppingBagIcon />}
            title={t("total_sales") || "Total Sales"}
            value={report?.totalSales ?? "0"}
            color="#2563eb"
            bgColor="#eff6ff"
          />
          <StatCard
            icon={<RefreshIcon />}
            title={t("total_refund") || "Total Refunds"}
            value={report?.totalRefunds ?? "0"}
            color="#d97706"
            bgColor="#fffbeb"
          />
          <StatCard
            icon={<CancelIcon />}
            title={t("cancel_orders") || "Cancelled Orders"}
            value={report?.canceledOrders ?? "0"}
            color="#dc2626"
            bgColor="#fef2f2"
          />
        </section>
      )}

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white col-span-1">
          <p className="text-green-100 text-sm font-medium mb-1">Pickup Address</p>
          <p className="font-semibold text-lg">
            {profile?.pickupAddress?.address
              ? `${profile.pickupAddress.address}, ${profile.pickupAddress.city || ""}, ${profile.pickupAddress.state || ""}`
              : "Not set"}
          </p>
          <p className="text-green-100 text-sm mt-1">
            PIN: {profile?.pickupAddress?.pinCode || "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-1">
          <p className="text-gray-500 text-sm font-medium mb-1 flex items-center gap-2">
            <InventoryIcon fontSize="small" /> Bank Details
          </p>
          <p className="font-semibold text-gray-800">
            {profile?.bankDetails?.accountHolderName || "Not set"}
          </p>
          <p className="text-gray-500 text-sm">
            A/C: {profile?.bankDetails?.accountNumber
              ? "•••• " + profile.bankDetails.accountNumber.slice(-4)
              : "—"}
          </p>
          <p className="text-gray-500 text-sm">
            IFSC: {profile?.bankDetails?.ifscCode || "—"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-1">
          <p className="text-gray-500 text-sm font-medium mb-1">Tax Details</p>
          <p className="font-semibold text-gray-800">GSTIN: {profile?.gstin || "—"}</p>
          <p className="text-gray-500 text-sm">PAN: {profile?.panNumber || "—"}</p>
          <p className="text-gray-500 text-sm mt-2">
            PAN Status:{" "}
            <span
              className={`font-medium ${
                profile?.panVerificationStatus === "VERIFIED"
                  ? "text-green-600"
                  : "text-amber-600"
              }`}
            >
              {profile?.panVerificationStatus || "PENDING"}
            </span>
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-gray-800 text-lg font-bold">Revenue Overview</h2>
            <p className="text-gray-500 text-sm">Track your earnings over time</p>
          </div>
          <div className="w-44">
            <FormControl fullWidth size="small">
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={handleChange}
              >
                {Chart.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="h-72">
          <SellingChart chartType={chartType} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
