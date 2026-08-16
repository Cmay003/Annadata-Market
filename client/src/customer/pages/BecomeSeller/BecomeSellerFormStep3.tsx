import React from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface BecomeSellerFormStep2Props {
  formik: any; // Replace 'any' with the correct type for formik instance
}

const BecomeSellerFormStep3: React.FC<BecomeSellerFormStep2Props> = ({ formik }) => {

  const { t } = useTranslation();
  return (
    <div className="space-y-5">
       
          <TextField
            fullWidth
            name="bankDetails.accountNumber"
            label={t("accountNumber")}
            value={formik.values.bankDetails.accountNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.bankDetails?.accountNumber && Boolean(formik.errors.bankDetails?.accountNumber)}
            helperText={formik.touched.bankDetails?.accountNumber && formik.errors.bankDetails?.accountNumber}
          />
          <TextField
            fullWidth
            name="bankDetails.ifscCode"
            label={t("ifscCode")}
            value={formik.values.bankDetails.ifscCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.bankDetails?.ifscCode && Boolean(formik.errors.bankDetails?.ifscCode)}
            helperText={formik.touched.bankDetails?.ifscCode && formik.errors.bankDetails?.ifscCode}
          />
          <TextField
            fullWidth
            name="bankDetails.accountHolderName"
            label={t("accountHolderName")}
            value={formik.values.bankDetails.accountHolderName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.bankDetails?.accountHolderName && Boolean(formik.errors.bankDetails?.accountHolderName)}
            helperText={formik.touched.bankDetails?.accountHolderName && formik.errors.bankDetails?.accountHolderName}
          />
    </div>
  );
};

export default BecomeSellerFormStep3;
