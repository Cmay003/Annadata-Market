import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {

      today: "Today",
      daily: "Last 7 days",
      monthly: "Last 12 Month",

      dashboard: "Dashboard",
      orders: "Orders",
      products: "Products",
      addProduct: "Add Product",
      payment: "Payment",
      transaction: "Transaction",
      account: "Account",
      logout: "Logout",

      save: "Save",
      sellerName: "Seller Name",
      email: "Email",
      mobile: "Mobile Number",

      businessName: "Business Name",
      gstin: "GST Number",
      accountStatus: "Account Status",

      address: "Address",
      city: "City",
      state: "State",

      bankDetails: "Bank Details",
      accountHolderName: "Account Holder Name",
      accountNumber: "Account Number",
      ifscCode: "IFSC Code",

      total_earning: "Total Earnings",

      title: "Title",
      description: "Description",
      mrpPrice: "MRP Price",
      sellingPrice: "Selling Price",
      quantity: "Quantity",
      weight: "Weight",
      unit: "Unit",
      category: "Category",
      grade: "Grade",
      addProductBtn: "Add Product",
      images: "Images",


      price: "Price",
      stock: "Stock",
      update: "Update",
      in_stock: "In Stock",
      out_stock: "Out of Stock",
      no_products: "No Products Found",

      total_earnings: "Total Earnings",
      total_sales: "Total Sales",
      total_refund: "Total Refund",
      cancel_orders: "Cancel Orders",
      addressLine1: "Address (House No, Building, Street)",


      locality: "Locality / Town",

      taxMobile: "Tax Details & Mobile",
      pickupAddress: "Pickup Address",
      supplierDetails: "Supplier Details",
      didNotReceiveOtp: "Didn’t receive OTP?",
      loginAsSeller: "Login as Seller",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      register: "Register",
      login: "Login",
      joinMarketplace: "Join the Marketplace Revolution",
      boostSales: "Boost Your Sales Today",
      contactDetails: "Contact Details",
      back: "Back",
      createAccount: "Create Account",
      continue: "Continue",
      sendOtp: "Send OTP",
      resendOtp: "Resend OTP",
      otpSent: "* OTP has been sent to your email",
      accountCreated: "Account created successfully",
      errorOccurred: "* Something went wrong",

      date: "Date",
      amount: "Amount",
      status: "Status",
      title_label: "Title",
      price_label: "Price",


      kg: "Kilogram",
      g: "Gram",
      piece: "Piece",
      dozen: "Dozen",
      litre: "Litre",

      grade_A: "Grade A (Premium)",
      grade_B: "Grade B (Standard)",
      grade_C: "Grade C (Economy)",


      grade_A_desc: "Best quality",
      grade_B_desc: "Daily use",
      grade_C_desc: "For processing",


      category_vegetables: "Vegetables",
      category_fruits: "Fruits",
      category_grains_cereals: "Grains & Cereals",
      category_pulses_lentils: "Pulses & Lentils",
      last_payment: "Last Payment",
      transaction_tab: "Transaction",
      customer_details: "Customer Details",
      order: "Order",
      order_id: "Order Id",
      payouts_tab: "Payouts",
      bank_details: "Bank Details",
      account_holder_name: "Account Holder Name",
      account_number: "Account Number",
      ifsc_code: "IFSC Code",

      account_holder_name_required: "Account Holder Name is required",
      account_number_required: "Account Number is required",
      ifsc_code_required: "IFSC Code is required",
      business_details: "Business Details",
      business_name: "Business Name",
      account_status: "Account Status",

      business_name_required: "Business Name is required",
      gstin_required: "GST Number is required",
      account_status_required: "Account Status is required",
      personal_details: "Personal Details",
      seller_name: "Seller Name",
      seller_email: "Email",
      seller_mobile: "Mobile Number",

      seller_name_required: "Seller Name is required",
      email_required: "Email is required",
      invalid_email: "Invalid email address",
      mobile_required: "Mobile number is required",
      pickup_address: "Pickup Address",


      address_required: "Address is required",
      city_required: "City is required",
      state_required: "State is required",





      not_provided: "Not Provided",
      profile_updated: "Profile Updated Successfully",
      "productAddedSuccess": "Product added successfully"



    },
  },

  hi: {
    translation: {
      "productAddedSuccess": "उत्पाद सफलतापूर्वक जोड़ा गया",

      today: "आज",
      daily: "पिछले 7 दिन",
      monthly: "पिछले 12 महीने",
      personal_details: "व्यक्तिगत विवरण",
      seller_name: "विक्रेता का नाम",
      seller_email: "ईमेल",
      seller_mobile: "मोबाइल नंबर",

      seller_name_required: "विक्रेता का नाम आवश्यक है",
      email_required: "ईमेल आवश्यक है",
      invalid_email: "अमान्य ईमेल पता",
      mobile_required: "मोबाइल नंबर आवश्यक है",
      business_details: "व्यवसाय विवरण",
      business_name: "व्यवसाय का नाम",
      gstin: "जीएसटी नंबर",
      account_status: "खाता स्थिति",

      business_name_required: "व्यवसाय का नाम आवश्यक है",
      gstin_required: "जीएसटी नंबर आवश्यक है",
      account_status_required: "खाता स्थिति आवश्यक है",
      bank_details: "बैंक विवरण",
      account_holder_name: "खाता धारक का नाम",
      account_number: "खाता संख्या",
      ifsc_code: "आईएफएससी कोड",
      save: "सेव करें",

      account_holder_name_required: "खाता धारक का नाम आवश्यक है",
      account_number_required: "खाता संख्या आवश्यक है",
      ifsc_code_required: "आईएफएससी कोड आवश्यक है",

      category_vegetables: "सब्जियां",
      category_fruits: "फल",
      category_grains_cereals: "अनाज और धान",
      category_pulses_lentils: "दालें",
      date: "तारीख",
      customer_details: "ग्राहक विवरण",
      order: "ऑर्डर",
      amount: "राशि",
      order_id: "ऑर्डर आईडी",
      payouts_tab: "भुगतान",

      total_earning: "कुल कमाई",
      last_payment: "अंतिम भुगतान",
      transaction_tab: "लेन-देन",
      status: "स्थिति",
      title_label: "शीर्षक",
      price_label: "कीमत",

      dashboard: "डैशबोर्ड",
      orders: "ऑर्डर",
      products: "उत्पाद",
      addProduct: "उत्पाद जोड़ें",
      payment: "भुगतान",
      transaction: "लेन-देन",
      account: "खाता",
      logout: "लॉगआउट",
      chartType: "चार्ट प्रकार",
      contactDetails: "आपकी जानकारी",

      joinMarketplace: "अपने उत्पाद बेचने के लिए जुड़ें",
      boostSales: "अपने उत्पाद बेचकर कमाई बढ़ाएं",

      locality: "इलाका / कस्बा",
      loginAsSeller: "विक्रेता के रूप में लॉगिन करें",
      dontHaveAccount: "खाता नहीं है?",
      alreadyHaveAccount: "पहले से खाता है?",

      sellerName: "विक्रेता का नाम",
      email: "ईमेल",
      mobile: "मोबाइल नंबर",

      businessName: "व्यवसाय का नाम",
      accountStatus: "खाता स्थिति",

      address: "पता",
      city: "शहर",
      state: "राज्य",
      addressLine1: "पता (घर नंबर, बिल्डिंग, गली)",

      bankDetails: "बैंक विवरण",
      accountHolderName: "खाता धारक का नाम",
      accountNumber: "खाता संख्या",
      ifscCode: "IFSC कोड",

      // Product
      title: "उत्पाद का नाम",
      description: "विवरण",
      mrpPrice: "एमआरपी मूल्य",
      sellingPrice: "बिक्री मूल्य",
      quantity: "मात्रा",
      weight: "वजन",
      unit: "इकाई",
      category: "श्रेणी",
      grade: "गुणवत्ता",
      addProductBtn: "उत्पाद जोड़ें",
      uploadProductImage: "उत्पाद की तस्वीर अपलोड करें",
      images: "तस्वीरें",
      updateProduct: "उत्पाद अपडेट करें",
      productUpdated: "उत्पाद सफलतापूर्वक अपडेट हुआ",

      // Table / Dashboard
      price: "कीमत",
      stock: "स्टॉक",
      update: "अपडेट",
      in_stock: "स्टॉक में",
      out_stock: "स्टॉक खत्म",
      no_products: "कोई उत्पाद नहीं मिला",

      total_earnings: "कुल कमाई",
      total_sales: "कुल बिक्री",
      total_refund: "कुल रिफंड",
      cancel_orders: "रद्द ऑर्डर",


      orderId: "ऑर्डर आईडी",
      orderStatus: "ऑर्डर स्थिति",
      pending: "लंबित",
      placed: "ऑर्डर दिया गया",
      confirmed: "पुष्टि हो गई",
      shipped: "भेज दिया गया",
      delivered: "डिलीवर हो गया",
      cancelled: "रद्द किया गया",


      otp: "OTP",
      pickupAddress: "पिकअप पता",
      password: "पासवर्ड",
      login: "लॉगिन",
      register: "रजिस्टर",
      continue: "आगे बढ़ें",
      back: "पीछे",
      createAccount: "खाता बनाएं",
      sendOtp: "OTP भेजें",
      resendOtp: "OTP फिर से भेजें",

      otpSent: "* OTP आपके ईमेल पर भेज दिया गया है",
      accountCreated: "खाता सफलतापूर्वक बन गया",
      errorOccurred: "* कुछ गलत हो गया",



      taxMobile: "टैक्स विवरण और मोबाइल",
      supplierDetails: "व्यापार जानकारी",
      didNotReceiveOtp: "OTP नहीं मिला?",

      kg: "किलोग्राम",
      g: "ग्राम",
      piece: "पीस",
      dozen: "दर्जन",
      litre: "लीटर",


      grade_A: "ग्रेड A (प्रीमियम)",
      grade_B: "ग्रेड B (सामान्य)",
      grade_C: "ग्रेड C (इकोनॉमी)",


      grade_A_desc: "बेहतरीन गुणवत्ता",
      grade_B_desc: "दैनिक उपयोग के लिए",
      grade_C_desc: "प्रोसेसिंग के लिए",

      pickup_address: "पिकअप पता",


      address_required: "पता आवश्यक है",
      city_required: "शहर आवश्यक है",
      state_required: "राज्य आवश्यक है",



      not_provided: "उपलब्ध नहीं",
      profile_updated: "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई"



    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "hi",

  // lng: "hi",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;