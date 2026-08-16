import  { use, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";
import { useTranslation } from "react-i18next";

export interface UpdateDetailsFormProps {
  onClose: () => void;
}
const BusinessDetailsForm = ({ onClose }: UpdateDetailsFormProps) => {
  const {t}=useTranslation();
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((store) => store);
  const formik = useFormik({
    initialValues: {
      businessName: "",
      gstin: "",
      accountStatus: "",
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required(t("business_name_required")),
      gstin: Yup.string().required(t("gstin_required")),
      accountStatus: Yup.string().required(t("account_status_required")),
    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        updateSeller({
          ...values,
          businessDetails: { businessName: values.businessName },
        })
      );
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        businessName: sellers.profile?.businessDetails?.businessName,
        gstin: sellers.profile?.gstin,
        accountStatus: sellers.profile?.accountStatus ?? "",
      });
    }
  }, [sellers.profile]);

  return (
    <>
      <h1 className="text-xl pb-5 text-center font-bold text-gray-600">
        {t("business_details")}
      </h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="businessName"
          name="businessName"
          label={t("business_name")}
          value={formik.values.businessName}
          onChange={formik.handleChange}
          error={
            formik.touched.businessName && Boolean(formik.errors.businessName)
          }
          helperText={formik.touched.businessName && formik.errors.businessName}
        />
        <TextField
          fullWidth
          id="gstin"
          name="gstin"
          label={t("gstin")}
          value={formik.values.gstin}
          onChange={formik.handleChange}
          error={formik.touched.gstin && Boolean(formik.errors.gstin)}
          helperText={formik.touched.gstin && formik.errors.gstin}
        />
        <TextField
          fullWidth
          id="accountStatus"
          name="accountStatus"
          label={t("account_status")}
          value={formik.values.accountStatus}
          onChange={formik.handleChange}
          error={
            formik.touched.accountStatus && Boolean(formik.errors.accountStatus)
          }
          helperText={
            formik.touched.accountStatus && formik.errors.accountStatus
          }
        />
        <Button
          sx={{ py: ".9rem" }}
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
        >
          {t("save")}
        </Button>
      </form>
    </>
  );
};

export default BusinessDetailsForm;
