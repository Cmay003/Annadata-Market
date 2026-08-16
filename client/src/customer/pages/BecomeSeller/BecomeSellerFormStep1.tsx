// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
import { Box, TextField} from "@mui/material";
import { useTranslation } from "react-i18next";
// import OTPInput from "../../components/OtpFild/OTPInput";

// Validation schema


// const BecomeSellerFormStep1 = ({ formik, handleOtpChange }: any) => {
const BecomeSellerFormStep1 = ({ formik}: any) => {
    const { t } = useTranslation();



    // const handleResendOTP = () => {
    //     console.log("handle resend otp")
    // }



    return (
        <Box  >
            <p className="text-xl font-bold text-center pb-9">{t("contactDetails")}</p>

            <div className="space-y-9">

                <TextField
                    fullWidth
                    name="mobile"
                    label={t("mobile")}
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                />

                {/* <div className="space-y-2">
                    <p className="font-medium text-sm">
                        * Enter OTP sent to your mobile number
                    </p>
                    <OTPInput
                        length={6}
                        onChange={handleOtpChange}
                        error={false}
                    />
                    <p className="text-xs space-x-2">
                        Didn’t receive OTP?{" "}
                        <span onClick={handleResendOTP} className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold">
                            Resend OTP
                        </span>
                    </p>
                </div> */}

                <TextField
                    fullWidth
                    name="GSTIN"
                    label={t("gstin")}
                    value={formik.values.GSTIN}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.GSTIN && Boolean(formik.errors.GSTIN)}
                    helperText={formik.touched.GSTIN && formik.errors.GSTIN}
                />
            </div>


        </Box>
    );
};

export default BecomeSellerFormStep1;
