import  { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import type { UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";
import { useTranslation } from "react-i18next";

const BankDetailsForm = ({ onClose }: UpdateDetailsFormProps) => {

  const { t } = useTranslation();
  const { sellers } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
    },
    validationSchema: Yup.object({
      accountHolderName: Yup.string().required(
        "Account Holder Name is required"
      ),
      accountNumber: Yup.string().required(t("account_number_required")),
      ifscCode: Yup.string().required(t("ifsc_code_required")),
    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        updateSeller({
          bankDetails: values,
         
        })
      );
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        accountHolderName: sellers.profile.bankDetails?.accountHolderName || "",
        accountNumber: sellers.profile.bankDetails?.accountNumber || "",
        ifscCode: sellers.profile.bankDetails?.ifscCode || "",
      });
    }
  }, [sellers.profile]);

  return (
    <>
      <h1 className="text-xl pb-5 text-center font-bold text-gray-600">
        {t("bank_details")}
      </h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="accountHolderName"
          name="accountHolderName"
          label={t("account_holder_name")}
          value={formik.values.accountHolderName}
          onChange={formik.handleChange}
          error={
            formik.touched.accountHolderName &&
            Boolean(formik.errors.accountHolderName)
          }
          helperText={
            formik.touched.accountHolderName && formik.errors.accountHolderName
          }
        />
        <TextField
          fullWidth
          id="accountNumber"
          name="accountNumber"
          label={t("account_number")}
          value={formik.values.accountNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.accountNumber && Boolean(formik.errors.accountNumber)
          }
          helperText={
            formik.touched.accountNumber && formik.errors.accountNumber
          }
        />
        <TextField
          fullWidth
          id="ifscCode"
          name="ifscCode"
          label={t("ifsc_code")}
          value={formik.values.ifscCode}
          onChange={formik.handleChange}
          error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)}
          helperText={formik.touched.ifscCode && formik.errors.ifscCode}
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

export default BankDetailsForm;
