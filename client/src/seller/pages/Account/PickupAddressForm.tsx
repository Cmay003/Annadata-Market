import  { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import type { UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";
import { useTranslation } from "react-i18next";

const PickupAddressForm = ({ onClose }: UpdateDetailsFormProps) => {
  const {t}=useTranslation();
  const { sellers } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      address: "",
      city: "",
      state: "",
      mobile: "",
    },
    validationSchema: Yup.object({
      address: Yup.string().required(t("address_required")),
      city: Yup.string().required(t("city_required")),
      state: Yup.string().required(t("state_required")),
      mobile: Yup.string().required(t("mobile_required")),
    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        updateSeller({
          pickupAddress: values,
         
        })
      );
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        address: sellers.profile.pickupAddress.address,
        city: sellers.profile.pickupAddress.city,
        state: sellers.profile.pickupAddress.state,
        mobile: sellers.profile.pickupAddress.mobile,
      });
    }
  }, [sellers.profile]);

  return (
    <>
      <h1 className="text-xl pb-5 text-center font-bold text-gray-600">
        {t("pickup_address")}
      </h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="address"
          name="address"
          label={t("address")}
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <TextField
          fullWidth
          id="city"
          name="city"
          label={t("city")}
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />
        <TextField
          fullWidth
          id="state"
          name="state"
          label={t("state")}
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
        />
        <TextField
          fullWidth
          id="mobile"
          name="mobile"
          label={t("mobile")}
          value={formik.values.mobile}
          onChange={formik.handleChange}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
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

export default PickupAddressForm;
