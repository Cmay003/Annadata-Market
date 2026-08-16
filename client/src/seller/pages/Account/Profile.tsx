import React, { useEffect, useState } from "react";
import {  useAppSelector } from "../../../Redux Toolkit/Store";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Modal,
  Snackbar,
} from "@mui/material";
import ProfileFildCard from "./ProfileFildCard";
import EditIcon from "@mui/icons-material/Edit";
import PersonalDetailsForm from "./PersionalDetailsForm";
import BusinessDetailsForm from "./BussinessDetailsForm";
import PickupAddressForm from "./PickupAddressForm";
import BankDetailsForm from "./BankDetailsForm";
import { useTranslation } from "react-i18next";

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const {t}=useTranslation();
  const { sellers } = useAppSelector((store) => store);
  const [open, setOpen] = React.useState(false);
  const [selectedForm, setSelectedForm] = useState("personalDetails");
  const handleClose = () => setOpen(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleOpen = (formName: string) => {
    setOpen(true);
    setSelectedForm(formName);
  };

  const renderSelectedForm = () => {
    switch (selectedForm) {
      case "personalDetails":
        return <PersonalDetailsForm onClose={handleClose} />;
      case "businessDetails":
        return <BusinessDetailsForm onClose={handleClose} />;
      case "pickupAddress":
        return <PickupAddressForm onClose={handleClose} />;
      case "bankDetails":
        return <BankDetailsForm onClose={handleClose} />;
      default:
        return null;
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // useEffect(() => {
  //   if (sellers.profileUpdated || sellers.error) {
  //     setOpenSnackbar(true);
  //   }
  // }, [sellers.profileUpdated]);
  const [hasMounted, setHasMounted] = useState(false);

useEffect(() => {
  if (!hasMounted) {
    setHasMounted(true);
    return;
  }

  if (sellers.profileUpdated || sellers.error) {
    setOpenSnackbar(true);
  }
}, [sellers.profileUpdated, sellers.error]);

  return (
    <div className="lg:p-20 space-y-20">
      <div className="w-full lg:w-[70%]  ">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600 ">
            {t("personal_details")}
          </h1>
          <div>
            <Button
              onClick={() => handleOpen("personalDetails")}
              size="small"
              sx={{ borderRadius: "2.9rem" }}
              variant="contained"
              className="w-16 h-16"
            >
              <EditIcon />
            </Button>
          </div>
        </div>
        <div className="space-y-5">
          <Avatar
            sx={{ width: "10rem", height: "10rem" }}
            src="https://cdn.pixabay.com/photo/2014/11/29/19/33/bald-eagle-550804_640.jpg"
          />
          <div>
            <ProfileFildCard
              keys={t("seller_name")}
              value={sellers.profile?.sellerName}
            />
            <Divider />
            <ProfileFildCard
              keys={t("seller_email")}
              value={sellers.profile?.email}
            />
            <Divider />
            <ProfileFildCard
              keys={t("seller_mobile")}
              value={sellers.profile?.mobile}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600 ">
            {t("business_details")}
          </h1>
          <div>
            <Button
              onClick={() => handleOpen("businessDetails")}
              size="small"
              sx={{ borderRadius: "2.9rem" }}
              variant="contained"
              className="w-16 h-16"
            >
              <EditIcon />
            </Button>
          </div>
        </div>

        <div className=" ">
          <ProfileFildCard
            keys={t("business_name")}
            value={sellers.profile?.businessDetails?.businessName}
          />
          <Divider />
          <ProfileFildCard
            keys={t("gstin")}
            value={sellers.profile?.gstin || "not provided"}
          />
          <Divider />
          <ProfileFildCard
            keys={t("account_status")}
            value={sellers.profile?.accountStatus}
          />
        </div>
      </div>
      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600 ">{t("pickup_address")}</h1>
          <div>
            <Button
              onClick={() => handleOpen("pickupAddress")}
              size="small"
              sx={{ borderRadius: "2.9rem" }}
              variant="contained"
              className="w-16 h-16"
            >
              <EditIcon />
            </Button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="">
            <ProfileFildCard
              keys={t("address")}
              value={sellers.profile?.pickupAddress?.address}
            />
            <Divider />
            <ProfileFildCard
              keys={t("city")}
              value={sellers.profile?.pickupAddress?.city || "not provided"}
            />
            <Divider />
            <ProfileFildCard
              keys={t("state")}
              value={sellers.profile?.pickupAddress?.state}
            />
            <Divider />
            <ProfileFildCard
              keys={t("mobile")}
              value={sellers.profile?.pickupAddress?.mobile}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600 ">{t("bank_details")}</h1>
          <div>
            <Button
              onClick={() => handleOpen("bankDetails")}
              size="small"
              sx={{ borderRadius: "2.9rem" }}
              variant="contained"
              className="w-16 h-16"
            >
              <EditIcon />
            </Button>
          </div>
        </div>
        <div className="space-y-5">
          <div className="">
            <ProfileFildCard
              keys={t("account_holder_name")}
              value={sellers.profile?.bankDetails?.accountHolderName}
            />
            <Divider />
            <ProfileFildCard
              keys={t("account_number")}
              value={
                sellers.profile?.bankDetails?.accountNumber || "not provided"
              }
            />
            <Divider />
            <ProfileFildCard
              keys={t("ifsc_code")}
              value={sellers.profile?.bankDetails?.ifscCode}
            />
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{renderSelectedForm()}</Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={sellers.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {sellers.error ? sellers.error : t("profile_updated")}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
