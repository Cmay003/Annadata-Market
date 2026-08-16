
// import { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";

// import Grid from "@mui/material/Grid";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CloseIcon from "@mui/icons-material/Close";

// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
// import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";

// // ✅ Validation
// const validationSchema = Yup.object({
//   title: Yup.string().required(),
//   description: Yup.string().required(),
//   mrpPrice: Yup.number().positive().required(),
//   sellingPrice: Yup.number().positive().required(),
//   quantity: Yup.number().positive().required(),
//   weight: Yup.number().positive().required(),
//   unit: Yup.string().required(),
//   grade: Yup.string().required(),
// });

// // ✅ Type
// interface FormValues {
//   title: string;
//   description: string;
//   mrpPrice: number;
//   sellingPrice: number;
//   discountPercent: number;
//   quantity: number;
//   weight: number;
//   unit: string;
//   grade: "A" | "B" | "C";
//   images: string[];
//   category: any;
//   in_stock: boolean;
// }

// const UpdateProductForm = () => {
//   const [uploadImage, setUploadingImage] = useState(false);
//   const [snackbarOpen, setOpenSnackbar] = useState(false);

//   const dispatch = useAppDispatch();
//   const sellerProduct = useAppSelector((store) => store.sellerProduct);
//   const products = useAppSelector((store) => store.products);

//   const { productId } = useParams();
//   const navigate = useNavigate();

//   const formik = useFormik<FormValues>({
//     initialValues: {
//       title: "",
//       description: "",
//       mrpPrice: 0,
//       sellingPrice: 0,
//       discountPercent: 0,
//       quantity: 0,
//       weight: 1,
//       unit: "kg",
//       grade: "B",
//       images: [],
//       category: "",
//       in_stock: true,
//     },
//     validationSchema,
//     onSubmit: (values) => {




//         const payload = {
//           title: values.title || "",
//           description: values.description || "",

//           mrpPrice: Number(values.mrpPrice ?? 0),
//           sellingPrice: Number(values.sellingPrice ?? 0),

//           discountPercent:
//             values.mrpPrice > 0
//               ? Math.round(
//                 ((values.mrpPrice - values.sellingPrice) / values.mrpPrice) * 100
//               )
//               : 0,

//           quantity: Number(values.quantity ?? 0),

//           weight: Number(values.weight ?? 1),
//           unit: values.unit || "kg",

//           grade: (values.grade || "B").toUpperCase(),

//           images: values.images ?? [],

//           // ✅ MAIN FIX
//           category:
//             typeof values.category === "object"
//               ? values.category.categoryId
//               : values.category,

//           in_stock: values.in_stock ?? true,
//         };

//         dispatch(updateProduct({ productId: Number(productId), product: payload }));
//       },
//   });

//   // ✅ Fetch product
//   useEffect(() => {
//     if (productId) {
//       dispatch(fetchProductById(Number(productId)));
//     }
//   }, [productId]);

//   // ✅ Set values
//   useEffect(() => {
//     if (products.product) {
//       formik.setValues({
//         title: products.product.title || "",
//         description: products.product.description || "",
//         mrpPrice: products.product.mrpPrice || 0,
//         sellingPrice: products.product.sellingPrice || 0,
//         discountPercent: products.product.discountPercent || 0,
//         quantity: products.product.quantity || 0,
//         weight: products.product.weight || 1,
//         unit: products.product.unit || "kg",
//         grade: products.product.grade || "B",
//         images: products.product.images || [],
//         category: products.product.category || "",
//         in_stock: products.product.in_stock ?? true,
//       });
//     }
//   }, [products.product]);

//   // ✅ Auto Discount
//   useEffect(() => {
//     const { mrpPrice, sellingPrice } = formik.values;

//     if (mrpPrice && sellingPrice) {
//       const discount =
//         ((mrpPrice - sellingPrice) / mrpPrice) * 100;

//       formik.setFieldValue("discountPercent", Math.round(discount));
//     }
//   }, [formik.values.mrpPrice, formik.values.sellingPrice]);

//   // ✅ Smart Pricing (Grade-based)
//   useEffect(() => {
//     const mrp = formik.values.mrpPrice;
//     if (!mrp) return;

//     let factor = 1;
//     if (formik.values.grade === "B") factor = 0.85;
//     if (formik.values.grade === "C") factor = 0.7;

//     formik.setFieldValue("sellingPrice", Math.round(mrp * factor));
//   }, [formik.values.grade]);

//   // ✅ Snackbar fix (use loading state)
//   // useEffect(() => {
//   //   if (!sellerProduct.loading) {
//   //     setOpenSnackbar(true);
//   //   }
//   // }, [sellerProduct.loading]);

//   // const handleCloseSnackbar = () => setOpenSnackbar(false);

//   // ✅ FIXED Snackbar
//   useEffect(() => {
//     if (sellerProduct.loading || sellerProduct.error) {
//       setOpenSnackbar(true);

//        setTimeout(() => {
//       navigate("/seller/products"); // 👈 your product page route
//     }, 1000);
//     }





//   }, [sellerProduct.loading, sellerProduct.error]);

//   const handleCloseSnackbar = () => setOpenSnackbar(false);

//   // ✅ Image Upload
//   const handleImageChange = async (e: any) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadingImage(true);
//     const url = await uploadToCloudinary(file);

//     formik.setFieldValue("images", [...formik.values.images, url]);
//     setUploadingImage(false);
//   };

//   const removeImage = (index: number) => {
//     const updated = [...formik.values.images];
//     updated.splice(index, 1);
//     formik.setFieldValue("images", updated);
//   };

//   return (
//     <div>
//       <form onSubmit={formik.handleSubmit} className="p-4">
//         <Grid container spacing={2}>

//           {/* Images */}
//           <Grid item xs={12} className="flex gap-3 flex-wrap">
//             <input hidden type="file" id="file" onChange={handleImageChange} />
//             <label htmlFor="file">
//               <div className="w-24 h-24 border flex items-center justify-center cursor-pointer">
//                 <AddPhotoAlternateIcon />
//               </div>
//             </label>

//             {uploadImage && <CircularProgress />}

//             {formik.values.images.map((img, i) => (
//               <div key={i} className="relative">
//                 <img src={img} className="w-24 h-24 object-cover" />
//                 <IconButton
//                   size="small"
//                   onClick={() => removeImage(i)}
//                   sx={{ position: "absolute", top: 0, right: 0 }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </div>
//             ))}
//           </Grid>

//           {/* Title */}
//           <Grid item xs={12}>
//             <TextField fullWidth label="Title" {...formik.getFieldProps("title")} />
//           </Grid>

//           {/* Description */}
//           <Grid item xs={12}>
//             <TextField multiline rows={3} fullWidth label="Description" {...formik.getFieldProps("description")} />
//           </Grid>

//           {/* Price */}
//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label="MRP" {...formik.getFieldProps("mrpPrice")} />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label="Selling Price" {...formik.getFieldProps("sellingPrice")} />
//           </Grid>

//           {/* Quantity */}
//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label="Quantity" {...formik.getFieldProps("quantity")} />
//           </Grid>

//           {/* Weight */}
//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label="Weight" {...formik.getFieldProps("weight")} />
//           </Grid>

//           {/* Unit */}
//           <Grid item xs={6}>
//             <FormControl fullWidth>
//               <InputLabel>Unit</InputLabel>
//               <Select {...formik.getFieldProps("unit")} label="Unit">
//                 <MenuItem value="kg">kg</MenuItem>
//                 <MenuItem value="g">gram</MenuItem>
//                 <MenuItem value="piece">piece</MenuItem>
//                 <MenuItem value="dozen">dozen</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* ✅ Grade */}
//           <Grid item xs={6}>
//             <FormControl fullWidth>
//               <InputLabel>Grade</InputLabel>
//               <Select {...formik.getFieldProps("grade")} label="Grade">
//                 <MenuItem value="A">Grade A (Premium)</MenuItem>
//                 <MenuItem value="B">Grade B (Standard)</MenuItem>
//                 <MenuItem value="C">Grade C (Economy)</MenuItem>
//               </Select>
//             </FormControl>

//             <p className="text-xs text-gray-500 mt-1">
//               {formik.values.grade === "A" && "Premium quality"}
//               {formik.values.grade === "B" && "Standard quality"}
//               {formik.values.grade === "C" && "Economy quality"}
//             </p>
//           </Grid>

//           {/* Submit */}
//           <Grid item xs={12}>
//             <Button fullWidth variant="contained" type="submit">
//               {sellerProduct.loading ? <CircularProgress size={24} /> : "Update Product"}
//             </Button>
//           </Grid>

//         </Grid>
//       </form>

//       {/* Snackbar */}
//       <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
//         <Alert severity={sellerProduct.error ? "error" : "success"}>
//           {sellerProduct.error || "Product Updated Successfully"}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default UpdateProductForm;

// import { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";

// import Grid from "@mui/material/Grid";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CloseIcon from "@mui/icons-material/Close";

// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
// import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";
// import { useTranslation } from "react-i18next";
// import productOptions from "../../../data/productOptions.json";

// // ✅ Validation
// const validationSchema = Yup.object({
//   title: Yup.string().required(),
//   description: Yup.string().required(),
//   mrpPrice: Yup.number().positive().required(),
//   sellingPrice: Yup.number().positive().required(),
//   quantity: Yup.number().positive().required(),
//   weight: Yup.number().positive().required(),
//   unit: Yup.string().required(),
//   grade: Yup.string().required(),
// });

// interface FormValues {
//   title: string;
//   description: string;
//   mrpPrice: number;
//   sellingPrice: number;
//   discountPercent: number;
//   quantity: number;
//   weight: number;
//   unit: string;
//   grade: "A" | "B" | "C";
//   images: string[];
//   category: any;
//   in_stock: boolean;
// }

// const UpdateProductForm = () => {
//   const { t } = useTranslation();
//   const { i18n } = useTranslation();
//   const lang = i18n.language === "hi" ? "hi" : "en";

//   const productss = productOptions[lang].products;


//   const [uploadImage, setUploadingImage] = useState(false);
//   const [snackbarOpen, setOpenSnackbar] = useState(false);

//   const dispatch = useAppDispatch();
//   const sellerProduct = useAppSelector((store) => store.sellerProduct);
//   const products = useAppSelector((store) => store.products);

//   const { productId } = useParams();
//   const navigate = useNavigate();

//   const formik = useFormik<FormValues>({
//     initialValues: {
//       title: "",
//       description: "",
//       mrpPrice: 0,
//       sellingPrice: 0,
//       discountPercent: 0,
//       quantity: 0,
//       weight: 1,
//       unit: "kg",
//       grade: "B",
//       images: [],
//       category: "",
//       in_stock: true,
//     },
//     validationSchema,
//     onSubmit: (values) => {




//       const payload = {
//         title: values.title || "",
//         description: values.description || "",

//         mrpPrice: Number(values.mrpPrice ?? 0),
//         sellingPrice: Number(values.sellingPrice ?? 0),

//         discountPercent:
//           values.mrpPrice > 0
//             ? Math.round(
//               ((values.mrpPrice - values.sellingPrice) / values.mrpPrice) * 100
//             )
//             : 0,

//         quantity: Number(values.quantity ?? 0),

//         weight: Number(values.weight ?? 1),
//         unit: values.unit || "kg",

//         grade: (values.grade || "B").toUpperCase(),

//         images: values.images ?? [],

//         // ✅ MAIN FIX
//         category:
//           typeof values.category === "object"
//             ? values.category.categoryId
//             : values.category,

//         in_stock: values.in_stock ?? true,
//       };

//       dispatch(updateProduct({ productId: Number(productId), product: payload }));
//     },
//   });

//   // ✅ Fetch product
//   useEffect(() => {
//     if (productId) {
//       dispatch(fetchProductById(Number(productId)));
//     }
//   }, [productId]);

//   // ✅ Set values
//   useEffect(() => {
//     if (products.product) {
//       formik.setValues({
//         title: products.product.title || "",
//         description: products.product.description || "",
//         mrpPrice: products.product.mrpPrice || 0,
//         sellingPrice: products.product.sellingPrice || 0,
//         discountPercent: products.product.discountPercent || 0,
//         quantity: products.product.quantity || 0,
//         weight: products.product.weight || 1,
//         unit: products.product.unit || "kg",
//         grade: products.product.grade || "B",
//         images: products.product.images || [],
//         category: products.product.category || "",
//         in_stock: products.product.in_stock ?? true,
//       });
//     }
//   }, [products.product]);

//   // ✅ Auto Discount
//   useEffect(() => {
//     const { mrpPrice, sellingPrice } = formik.values;

//     if (mrpPrice && sellingPrice) {
//       const discount =
//         ((mrpPrice - sellingPrice) / mrpPrice) * 100;

//       formik.setFieldValue("discountPercent", Math.round(discount));
//     }
//   }, [formik.values.mrpPrice, formik.values.sellingPrice]);

//   // ✅ Smart Pricing (Grade-based)
//   useEffect(() => {
//     const mrp = formik.values.mrpPrice;
//     if (!mrp) return;

//     let factor = 1;
//     if (formik.values.grade === "B") factor = 0.85;
//     if (formik.values.grade === "C") factor = 0.7;

//     formik.setFieldValue("sellingPrice", Math.round(mrp * factor));
//   }, [formik.values.grade]);

//   // ✅ Snackbar fix (use loading state)
//   // useEffect(() => {
//   //   if (!sellerProduct.loading) {
//   //     setOpenSnackbar(true);
//   //   }
//   // }, [sellerProduct.loading]);

//   // const handleCloseSnackbar = () => setOpenSnackbar(false);

//   // ✅ FIXED Snackbar
//   useEffect(() => {
//     if (sellerProduct.loading || sellerProduct.error) {
//       setOpenSnackbar(true);

//       setTimeout(() => {
//         navigate("/seller/products"); // 👈 your product page route
//       }, 1000);
//     }





//   }, [sellerProduct.loading, sellerProduct.error]);

//   const handleCloseSnackbar = () => setOpenSnackbar(false);

//   // ✅ Image Upload
//   const handleImageChange = async (e: any) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadingImage(true);
//     const url = await uploadToCloudinary(file);

//     formik.setFieldValue("images", [...formik.values.images, url]);
//     setUploadingImage(false);
//   };

//   const removeImage = (index: number) => {
//     const updated = [...formik.values.images];
//     updated.splice(index, 1);
//     formik.setFieldValue("images", updated);
//   };
//   return (
//     <div>
//       <form onSubmit={formik.handleSubmit} className="p-4">
//         <Grid container spacing={2}>

//           {/* Image Upload */}
//           <Grid item xs={12} className="flex gap-3 flex-wrap">
//             <input hidden type="file" id="file" onChange={handleImageChange} />

//             <label htmlFor="file" className="flex flex-col items-center">
//               <div className="w-24 h-24 border flex items-center justify-center cursor-pointer">
//                 <AddPhotoAlternateIcon />
//               </div>

//               <p className="text-sm text-gray-500 mt-2">
//                 {t("uploadProductImage")}
//               </p>
//             </label>

//             {uploadImage && <CircularProgress />}

//             {formik.values.images.map((img, i) => (
//               <div key={i} className="relative">
//                 <img src={img} className="w-24 h-24 object-cover" />
//                 <IconButton
//                   size="small"
//                   onClick={() => removeImage(i)}
//                   sx={{ position: "absolute", top: 0, right: 0 }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </div>
//             ))}
//           </Grid>

//           {/* Title */}
//           {/* <Grid item xs={12}>
//             <TextField fullWidth label={t("title")} {...formik.getFieldProps("title")} />
//           </Grid> */}
//           <Grid item xs={12}>
//             <FormControl fullWidth>
//               <InputLabel>{t("title")}</InputLabel>
//               <Select
//                 name="title"
//                 value={formik.values.title}
//                 onChange={(e) => {
//                   const selectedTitle = e.target.value;

//                   const selectedProduct = productss.find(
//                     (p: any) => p.title === selectedTitle
//                   );

//                   formik.setFieldValue("title", selectedTitle);

//                   // ✅ Auto description fill
//                   if (selectedProduct) {
//                     formik.setFieldValue("description", selectedProduct.description);
//                   }
//                 }}
//                 label={t("title")}
//               >
//                 {productss.map((item: any, index: number) => (
//                   <MenuItem key={index} value={item.title}>
//                     {item.title}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Description */}
//           {/* <Grid item xs={12}>
//             <TextField multiline rows={3} fullWidth label={t("description")} {...formik.getFieldProps("description")} />
//           </Grid> */}

//           <Grid item xs={12}>
//             <TextField
//               multiline
//               rows={3}
//               fullWidth
//               label={t("description")}
//               name="description"
//               value={formik.values.description}
//               InputProps={{ readOnly: true }} // 🔥 important
//             />
//           </Grid>

//           {/* Price */}
//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label={t("mrpPrice")} {...formik.getFieldProps("mrpPrice")} />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label={t("sellingPrice")} {...formik.getFieldProps("sellingPrice")} />
//           </Grid>

//           {/* Quantity */}
//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label={t("quantity")} {...formik.getFieldProps("quantity")} />
//           </Grid>

//           {/* Weight */}
//           <Grid item xs={6}>
//             <TextField type="number" fullWidth label={t("weight")} {...formik.getFieldProps("weight")} />
//           </Grid>

//           {/* Unit */}
//           {/* <Grid item xs={6}>
//             <FormControl fullWidth>
//               <InputLabel>{t("unit")}</InputLabel>
//               <Select {...formik.getFieldProps("unit")} label={t("unit")}>
//                 <MenuItem value="kg">किलोग्राम</MenuItem>
//                 <MenuItem value="g">ग्राम</MenuItem>
//                 <MenuItem value="piece">पीस</MenuItem>
//                 <MenuItem value="dozen">दर्जन</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid> */}

//           <Grid item xs={6}>
//             <FormControl fullWidth>
//               <InputLabel>{t("unit")}</InputLabel>
//               <Select {...formik.getFieldProps("unit")} label={t("unit")}>
//                 <MenuItem value="kg">{t("kg")}</MenuItem>
//                 <MenuItem value="g">{t("g")}</MenuItem>
//                 <MenuItem value="piece">{t("piece")}</MenuItem>
//                 <MenuItem value="dozen">{t("dozen")}</MenuItem>
//                 <MenuItem value="litre">{t("litre")}</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>

//           {/* Grade */}
//           {/* <Grid item xs={6}>
//             <FormControl fullWidth>
//               <InputLabel>{t("grade")}</InputLabel>
//               <Select {...formik.getFieldProps("grade")} label={t("grade")}>
//                 <MenuItem value="A">ग्रेड A (प्रीमियम)</MenuItem>
//                 <MenuItem value="B">ग्रेड B (सामान्य)</MenuItem>
//                 <MenuItem value="C">ग्रेड C (इकोनॉमी)</MenuItem>
//               </Select>
//             </FormControl>

//             <p className="text-xs text-gray-500 mt-1">
//               {formik.values.grade === "A" && "उच्च गुणवत्ता"}
//               {formik.values.grade === "B" && "सामान्य उपयोग"}
//               {formik.values.grade === "C" && "कम गुणवत्ता"}
//             </p>
//           </Grid> */}


//           <Grid item xs={6}>
//             <FormControl fullWidth>
//               <InputLabel>{t("grade")}</InputLabel>
//               <Select {...formik.getFieldProps("grade")} label={t("grade")}>
//                 <MenuItem value="A">{t("grade_A")}</MenuItem>
//                 <MenuItem value="B">{t("grade_B")}</MenuItem>
//                 <MenuItem value="C">{t("grade_C")}</MenuItem>
//               </Select>
//             </FormControl>

//             <p className="text-xs text-gray-500 mt-1">
//               {t(`grade_${formik.values.grade}_desc`)}
//             </p>
//           </Grid>

//           {/* Submit */}
//           <Grid item xs={12}>
//             <Button fullWidth variant="contained" type="submit">
//               {sellerProduct.loading ? (
//                 <CircularProgress size={24} />
//               ) : (
//                 t("updateProduct")
//               )}
//             </Button>
//           </Grid>

//         </Grid>
//       </form>

//       {/* Snackbar */}
//       <Snackbar open={snackbarOpen} autoHideDuration={4000}>
//         <Alert severity={sellerProduct.error ? "error" : "success"}>
//           {sellerProduct.error || t("productUpdated")}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };


// export default UpdateProductForm;

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
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../../Redux Toolkit/Customer/ProductSlice";
import { useTranslation } from "react-i18next";
import productOptions from "../../../data/productOptions.json";
import { mainCategory } from "../../../data/category/mainCategory";

// ✅ TYPES
type ProductItem = {
  title: string;
  description: string;
};

type CategoryProducts = {
  [key: string]: ProductItem[];
};

type ProductOptionsType = {
  en: CategoryProducts;
  hi: CategoryProducts;
};

// ✅ VALIDATION
const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  mrpPrice: Yup.number().positive().required(),
  sellingPrice: Yup.number().positive().required(),
  quantity: Yup.number().positive().required(),
  weight: Yup.number().positive().required(),
  unit: Yup.string().required(),
  category: Yup.string().required(),
  grade: Yup.string().required(),
});

interface FormValues {
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity: number;
  weight: number;
  unit: string;
  grade: "A" | "B" | "C";
  images: string[];
  category: any;
  in_stock: boolean;
}

const UpdateProductForm = () => {
  const typedProductOptions = productOptions as ProductOptionsType;

  const { t, i18n } = useTranslation();
  const lang = i18n.language === "hi" ? "hi" : "en";

  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [uploadImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const dispatch = useAppDispatch();
  const sellerProduct = useAppSelector((store) => store.sellerProduct);
  const products = useAppSelector((store) => store.products);

  const { productId } = useParams();
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: 0,
      sellingPrice: 0,
      discountPercent: 0,
      quantity: 1,
      weight: 1,
      unit: "kg",
      grade: "B",
      images: [],
      category: "",
      in_stock: true,
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        discountPercent:
          values.mrpPrice > 0
            ? Math.round(
                ((values.mrpPrice - values.sellingPrice) /
                  values.mrpPrice) *
                  100
              )
            : 0,
      };

      dispatch(
        updateProduct({
          productId: Number(productId),
          product: payload,
          jwt: localStorage.getItem("seller_jwt") || "",
        })
      );
    },
  });

  // ✅ FETCH PRODUCT
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)));
    }
  }, [productId]);

  // ✅ SET VALUES
  // useEffect(() => {
  //   if (products.product) {
  //     formik.setValues({
  //       ...products.product,
  //     });
  //   }
  // }, [products.product]);

  useEffect(() => {
  if (products.product) {
    formik.setValues({
      title: products.product.title || "",
      description: products.product.description || "",
      mrpPrice: products.product.mrpPrice || 0,
      sellingPrice: products.product.sellingPrice || 0,
      discountPercent: products.product.discountPercent || 0,
      quantity: products.product.quantity || 0,
      weight: products.product.weight || 1,
      unit: products.product.unit || "kg",
      grade: products.product.grade || "B",
      images: products.product.images || [],
      category: products.product.category || "",
      in_stock: products.product.in_stock ?? true,
    });
  }
}, [products.product]);

  // ✅ CATEGORY FILTER
  useEffect(() => {
    if (formik.values.category) {
      const categoryProducts =
        typedProductOptions[lang]?.[formik.values.category] || [];

      setFilteredProducts(categoryProducts);
    }
  }, [formik.values.category, lang]);

  // ✅ AUTO DISCOUNT
  useEffect(() => {
    const { mrpPrice, sellingPrice } = formik.values;

    if (mrpPrice && sellingPrice) {
      const discount =
        ((mrpPrice - sellingPrice) / mrpPrice) * 100;

      formik.setFieldValue("discountPercent", Math.round(discount));
    }
  }, [formik.values.mrpPrice, formik.values.sellingPrice]);

  // ✅ SMART PRICE (GRADE)
  useEffect(() => {
    const mrp = formik.values.mrpPrice;
    if (!mrp) return;

    let factor = 1;
    if (formik.values.grade === "B") factor = 0.85;
    if (formik.values.grade === "C") factor = 0.7;

    formik.setFieldValue("sellingPrice", Math.round(mrp * factor));
  }, [formik.values.grade]);

  // ✅ SNACKBAR
  useEffect(() => {
    if (sellerProduct.productUpdated || sellerProduct.error) {
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/seller/products");
      }, 1200);
    }
  }, [sellerProduct.productUpdated, sellerProduct.error]);

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const url = await uploadToCloudinary(file);

    formik.setFieldValue("images", [...formik.values.images, url]);
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="p-4">
      <Grid container spacing={2}>

        {/* IMAGE */}
        <Grid item xs={12} className="flex gap-3 flex-wrap">
          <input hidden type="file" id="file" onChange={handleImageChange} />

          <label htmlFor="file">
            <div className="w-24 h-24 border flex items-center justify-center cursor-pointer">
              <AddPhotoAlternateIcon />
            </div>
          </label>

          {uploadImage && <CircularProgress />}

          {formik.values.images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="w-24 h-24 object-cover" />
              <IconButton
                onClick={() => removeImage(i)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          ))}
        </Grid>

        {/* CATEGORY */}
        <Grid item xs={12} sm={6}>
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
          <FormControl fullWidth>
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
              {filteredProducts.map((item, index) => (
                <MenuItem key={index} value={item.title}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* DESCRIPTION */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("description")}
            value={formik.values.description}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        {/* PRICES */}
        <Grid item xs={6}>
          <TextField fullWidth label={t("mrpPrice")} name="mrpPrice" type="number" value={formik.values.mrpPrice} onChange={formik.handleChange} />
        </Grid>

        <Grid item xs={6}>
          <TextField fullWidth label={t("sellingPrice")} name="sellingPrice" type="number" value={formik.values.sellingPrice} onChange={formik.handleChange} />
        </Grid>

        {/* QUANTITY */}
        <Grid item xs={6}>
          <TextField fullWidth label={t("quantity")} name="quantity" type="number" value={formik.values.quantity} onChange={formik.handleChange} />
        </Grid>

        {/* WEIGHT */}
        <Grid item xs={6}>
          <TextField fullWidth label={t("weight")} name="weight" type="number" value={formik.values.weight} onChange={formik.handleChange} />
        </Grid>

        {/* UNIT */}
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>{t("grade")}</InputLabel>
            <Select name="grade" value={formik.values.grade} onChange={formik.handleChange}>
              <MenuItem value="A">{t("grade_A")}</MenuItem>
              <MenuItem value="B">{t("grade_B")}</MenuItem>
              <MenuItem value="C">{t("grade_C")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* SUBMIT */}
        <Grid item xs={12}>
          <Button fullWidth variant="contained" type="submit">
            {sellerProduct.loading ? <CircularProgress size={24} /> : t("updateProduct")}
          </Button>
        </Grid>

      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={4000}>
        <Alert severity={sellerProduct.error ? "error" : "success"}>
          {sellerProduct.error || t("productUpdated")}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default UpdateProductForm;