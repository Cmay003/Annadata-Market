
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { mainCategory } from "../../../data/category/mainCategory";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useTranslation } from "react-i18next";
import productOptions from "../../../data/productOptions.json";

// ✅ TYPES
type ProductItem = {
  title: string;
  description: string;
};

type ProductOptionsType = {
  en: Record<string, ProductItem[]>;
  hi: Record<string, ProductItem[]>;
};

const ProductForm = () => {
  const typedProductOptions = productOptions as ProductOptionsType;

  const { i18n, t } = useTranslation();
  const lang = i18n.language === "hi" ? "hi" : "en";

  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const dispatch = useAppDispatch();
  const sellerProduct = useAppSelector((store) => store.sellerProduct);

  // const validationSchema = Yup.object({
  //   title: Yup.string().required(t("title") + " required"),
  //   description: Yup.string().required(t("description") + " required"),
  //   mrpPrice: Yup.number().required(),
  //   sellingPrice: Yup.number().required(),
  //   quantity: Yup.number().required(),
  //   weight: Yup.number().required(),
  //   unit: Yup.string().required(),
  //   category: Yup.string().required(),
  //   grade: Yup.string().required(),
  // });

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, t("title") + " कम से कम 3 अक्षरों का होना चाहिए")
      .required(t("title") + " आवश्यक है"),
    description: Yup.string()
      .min(10, t("description") + " कम से कम 10 अक्षरों का होना चाहिए")
      .required(t("description") + " आवश्यक है"),
    mrpPrice: Yup.number()
      .positive(t("mrpPrice") + " 0 से अधिक होना चाहिए")
      .required(t("mrpPrice") + " आवश्यक है"),
    sellingPrice: Yup.number()
      .positive(t("sellingPrice") + " 0 से अधिक होना चाहिए")
      .required(t("sellingPrice") + " आवश्यक है"),
    quantity: Yup.number()
      .positive(t("quantity") + " 0 से अधिक होना चाहिए")
      .required(t("quantity") + " आवश्यक है"),
    weight: Yup.number()
      .positive(t("weight") + " 0 से अधिक होना चाहिए")
      .required(t("weight") + " आवश्यक है"),
    unit: Yup.string().required(t("unit") + " आवश्यक है"),
    category: Yup.string().required(t("category") + " आवश्यक है"),
    grade: Yup.string().required(t("grade") + " आवश्यक है"),
  });


  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: 0,
      sellingPrice: 0,
      quantity: 1,
      weight: 1,
      unit: "kg",
      grade: "B",
      images: [] as string[],
      category: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        createProduct({
          request: values,
          jwt: localStorage.getItem("seller_jwt"),
        })
      );
    },
  });

  // ✅ CATEGORY → PRODUCTS FILTER
  useEffect(() => {
    if (formik.values.category) {
      const categoryProducts =
        typedProductOptions[lang]?.[formik.values.category] || [];

      setFilteredProducts(categoryProducts);

      formik.setFieldValue("title", "");
      formik.setFieldValue("description", "");
    } else {
      setFilteredProducts([]);
    }
  }, [formik.values.category, lang]);

  // IMAGE UPLOAD
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const image = await uploadToCloudinary(file);
      formik.setFieldValue("images", [
        ...formik.values.images,
        image,
      ]);
    } catch (err) {
      console.error(err);
    }
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    if (sellerProduct.productCreated || sellerProduct.error) {
      setOpenSnackbar(true);
      formik.resetForm();
    }
  }, [sellerProduct.productCreated, sellerProduct.error]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>

          {/* IMAGE */}
          <Grid item xs={12} className="flex flex-wrap gap-5">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              hidden
              onChange={handleImageChange}
            />

            <label htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md">
                <AddPhotoAlternateIcon />
                <p className="text-sm text-gray-600 mt-2">
                  {t("uploadProductImage")}
                </p>
              </span>
              {uploadImage && <CircularProgress size={24} />}
            </label>

            <div className="flex gap-2">
              {formik.values.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="w-24 h-24 object-cover" />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveImage(i)}
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          {/* CATEGORY */}
          <Grid item xs={12} sm={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel>{t("category")}</InputLabel>

              <Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              >
                {mainCategory.map((item) => (
                  <MenuItem key={item.categoryId} value={item.categoryId}>
                    {t(`category_${item.categoryId}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* TITLE */}
          <Grid item xs={12}>
            <FormControl fullWidth disabled={!formik.values.category}>
              <InputLabel>{t("title")}</InputLabel>

              <Select
                name="title"
                value={formik.values.title}
                onChange={(e) => {
                  const selectedTitle = e.target.value;

                  const selectedProduct = filteredProducts.find(
                    (p) => p.title === selectedTitle
                  );

                  formik.setFieldValue("title", selectedTitle);

                  if (selectedProduct) {
                    formik.setFieldValue(
                      "description",
                      selectedProduct.description
                    );
                  }
                }}
              >
                {filteredProducts.length === 0 ? (
                  <MenuItem disabled>Select category first</MenuItem>
                ) : (
                  filteredProducts.map((item, index) => (
                    <MenuItem key={index} value={item.title}>
                      {item.title}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* DESCRIPTION */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("description")}
              name="description"
              value={formik.values.description}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* PRICES */}
          <Grid item xs={12} sm={6} lg={3}>
            <TextField fullWidth label={t("mrpPrice")} name="mrpPrice" type="number" value={formik.values.mrpPrice} onChange={formik.handleChange} />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <TextField fullWidth label={t("sellingPrice")} name="sellingPrice" type="number" value={formik.values.sellingPrice} onChange={formik.handleChange} />
          </Grid>

          {/* QUANTITY */}
          <Grid item xs={12} sm={6} lg={3}>
            <TextField fullWidth label={t("quantity")} name="quantity" type="number" value={formik.values.quantity} onChange={formik.handleChange} />
          </Grid>

          {/* WEIGHT */}
          <Grid item xs={12} sm={6} lg={3}>
            <TextField fullWidth label={t("weight")} name="weight" type="number" value={formik.values.weight} onChange={formik.handleChange} />
          </Grid>

          {/* UNIT */}
          <Grid item xs={12} sm={6} lg={3}>
            <FormControl fullWidth>
              <InputLabel>{t("unit")}</InputLabel>
              <Select name="unit" value={formik.values.unit} onChange={formik.handleChange}>
                <MenuItem value="kg">{t("kg")}</MenuItem>
                <MenuItem value="g">{t("g")}</MenuItem>
                <MenuItem value="piece">{t("piece")}</MenuItem>
                <MenuItem value="dozen">{t("dozen")}</MenuItem>
                <MenuItem value="litre">{t("litre")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* GRADE */}
          <Grid item xs={12} sm={6} lg={4}>
            <FormControl fullWidth>
              <InputLabel>{t("grade")}</InputLabel>
              <Select name="grade" value={formik.values.grade} onChange={formik.handleChange}>
                <MenuItem value="A">{t("grade_A")}</MenuItem>
                <MenuItem value="B">{t("grade_B")}</MenuItem>
                <MenuItem value="C">{t("grade_C")}</MenuItem>
              </Select>
            </FormControl>

            <p className="text-xs text-gray-500 mt-1">
              {formik.values.grade === "A" && t("grade_A_desc")}
              {formik.values.grade === "B" && t("grade_B_desc")}
              {formik.values.grade === "C" && t("grade_C_desc")}
            </p>
          </Grid>

          {/* SUBMIT */}
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" disabled={sellerProduct.loading || uploadImage}>
              {sellerProduct.loading ? <CircularProgress size={24} /> : t("addProductBtn")}
            </Button>
          </Grid>

        </Grid>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity={sellerProduct.error ? "error" : "success"} onClose={handleCloseSnackbar}>
          {sellerProduct.error || t("productAddedSuccess")}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductForm;