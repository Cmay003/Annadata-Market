import  { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import type { UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";
import { useTranslation } from "react-i18next";

const PersonalDetailsForm = ({ onClose }: UpdateDetailsFormProps) => {
    const { t } = useTranslation();
    const { sellers } = useAppSelector(store => store)
    const dispatch=useAppDispatch();

    const formik = useFormik({
        initialValues: {
            sellerName: '',
            email: '',
            mobile: '',
        },
        validationSchema: Yup.object({
            sellerName: Yup.string().required(t("seller_name_required")),
            email: Yup.string().email(t("invalid_email")).required(t("email_required")),
            mobile: Yup.string().required(t("mobile_required")),
        }),
        onSubmit: (values) => {
            
            console.log("data ----- ",values);
            dispatch(updateSeller(values))
            onClose()
        },
    });

    useEffect(() => {

        if (sellers.profile) {
            formik.setValues({
                sellerName: sellers.profile?.sellerName,
                email: sellers.profile?.email,
                mobile: sellers.profile?.mobile,

            })
        }

    }, [sellers.profile])

    return (
        <>
            <h1 className="text-xl pb-5 text-center font-bold text-gray-600">
                {t("personal_details")}
            </h1>
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="sellerName"
                    name="sellerName"
                    label={t("seller_name")}
                    value={formik.values.sellerName}
                    onChange={formik.handleChange}
                    error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
                    helperText={formik.touched.sellerName && formik.errors.sellerName}
                />
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label={t("seller_email")}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth
                    id="mobile"
                    name="mobile"
                    label={t("seller_mobile")}
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                />
                <Button sx={{ py: ".9rem" }} color="primary" variant="contained" fullWidth type="submit">
                    {t("save")}
                </Button>
            </form>
        </>

    );
};

export default PersonalDetailsForm;
