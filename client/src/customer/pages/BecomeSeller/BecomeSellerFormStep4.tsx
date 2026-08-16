import { TextField } from '@mui/material'
import { useTranslation } from 'react-i18next';
// import React from 'react'
interface BecomeSellerFormStep2Props {
  formik: any; // Replace 'any' with the correct type for formik instance
}

const BecomeSellerFormStep4 = ({ formik }: BecomeSellerFormStep2Props) => {
  const { t } = useTranslation();
  return (
    <div className='space-y-5'>

      <TextField
        fullWidth
        name="businessDetails.businessName"
        label={t("businessName")}
        value={formik.values.businessDetails.businessName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched?.businessDetails?.businessName && Boolean(formik.errors?.businessDetails?.businessName)}
        helperText={formik.touched?.businessDetails?.businessName && formik.errors?.businessDetails?.businessName}
      />

      <TextField
        fullWidth
        name="sellerName"
        label={t("sellerName")}
        value={formik.values.sellerName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
        helperText={formik.touched.sellerName && formik.errors.sellerName}
      />

      <TextField
        fullWidth
        name="email"
        label={t("email")}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        fullWidth
        name="password"
        label={t("password")}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched?.password && Boolean(formik.errors?.password)}
        helperText={formik.touched?.password && formik.errors?.password}
      />





    </div>
  )
}

export default BecomeSellerFormStep4