
// import { useState, useEffect } from "react";
// import ChatBot from "../ChatBot/ChatBot";
// import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
// import StorefrontIcon from "@mui/icons-material/Storefront";
// import {
//   Backdrop,
//   Button,
//   CircularProgress,
//   useMediaQuery,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
// import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
// import { ChevronRight } from "lucide-react";
// import { categories } from "../../../data/mockData";
// import ProductCard from "../Products/ProductCard/ProductCard";
// import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";

// const Home = () => {
//   const isMobile = useMediaQuery("(max-width:768px)");
//   const [showChatBot, setShowChatBot] = useState(false);

//   const dispatch = useAppDispatch();
//   // const [selectedCategory, setSelectedCategory] = useState("all");
//   const homePage = useAppSelector((store) => store.homePage);
//   const products = useAppSelector((store) => store.products);

//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(fetchHomePageData());
//     dispatch(getAllProducts({ pageNumber: 0 }));
//   }, [dispatch]);

//   if (homePage.loading) {
//     return (
//       <Backdrop open>
//         <CircularProgress />
//       </Backdrop>
//     );
//   }

//   return (
//     <div className="space-y-12">


//       <section className="relative overflow-hidden bg-gradient-to-br from-green-100 via-white to-green-50 py-14 md:py-20">

//         {/* Background Blur Circle */}
//         <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-green-300 rounded-full blur-3xl opacity-30"></div>
//         <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-green-400 rounded-full blur-3xl opacity-30"></div>

//         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-10">

//           {/* LEFT CONTENT */}
//           <div className="flex-1 text-center md:text-left">

//             {/* Tag */}
//             <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mb-4">
//               🌱 100% Organic & Fresh
//             </span>

//             {/* Heading */}
//             <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
//               Farm Fresh <br />
//               <span className="text-[#00927c]">Delivered to You</span>
//             </h1>

//             {/* Subtext */}
//             <p className="mt-4 text-gray-600 text-sm md:text-lg">
//               Directly from farmers to your home. No middleman, better prices, fresher food.
//             </p>




//             {/* CTA BUTTONS */}
//             <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
//               <Link
//                 to="/products"
//                 className="bg-[#00927c] hover:bg-[#007a66] text-white px-6 py-3 rounded-lg shadow-md transition"
//               >
//                 Shop Now
//               </Link>

//               <Button
//                 onClick={() => navigate("/become-seller")}
//                 variant="outlined"
//               >
//                 Become Seller
//               </Button>
//             </div>
//           </div>

//           {/* RIGHT IMAGE + FLOATING CARDS */}
//           <div className="flex-1 relative">

//             <img
//               src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
//               className="rounded-2xl shadow-xl w-full object-cover"
//             />

//             {/* Floating Card 1 */}
//             <div className="absolute top-4 left-4 bg-white p-3 rounded-xl shadow-lg text-sm">
//               🥕 Fresh Veggies
//             </div>

//             {/* Floating Card 2 */}
//             <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg text-sm">
//               🚚 Fast Delivery
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= CATEGORY ================= */}
//       <section className="max-w-7xl mx-auto px-4">
//         <h2 className="text-2xl md:text-3xl font-bold mb-6">
//           Shop by Category
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {categories.map((cat) => (
//             <Link
//               key={cat.id}
//               to={`/products?category=${cat.id}`}
//               className="bg-white p-4 rounded-xl shadow hover:shadow-lg text-center transition hover:-translate-y-1"
//             >
//               <div className="text-3xl mb-2">{cat.icon}</div>
//               <p className="text-sm font-medium">{cat.name}</p>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* ================= PRODUCTS ================= */}
//       <section className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl md:text-3xl font-bold">
//             Featured Products
//           </h2>

//           <Link to="/products" className="flex items-center text-green-600">
//             View All <ChevronRight />
//           </Link>
//         </div>

//         {products.products?.length > 0 ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {products.products.slice(0, isMobile ? 2 : 4).map((item: any) => (
//               <ProductCard key={item.id} item={item} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <img
//               src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
//               className="w-60 mx-auto mb-4"
//             />
//             <h3 className="text-xl font-semibold">No Products Found</h3>
//           </div>
//         )}
//       </section>

//       {/* ================= SELLER BANNER ================= */}
//       {/* <section className="relative h-[250px] md:h-[400px]">
//         <img
//           src="/seller-banner.png"
//           className="w-full h-full object-cover rounded-xl"
//         />

//         <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center">
//           <h2 className="text-2xl md:text-4xl font-bold">
//             Sell Your Products
//           </h2>
//           <Button
//             onClick={() => navigate("/become-seller")}
//             variant="contained"
//             startIcon={<StorefrontIcon />}
//             sx={{ mt: 2 }}
//           >
//             Become Seller
//           </Button>
//         </div>
//       </section> */}

//       <section className="relative h-[220px] md:h-[400px]">
//   <img
//     src="/seller-banner.png"
//     className="w-full h-full object-contain md:object-cover rounded-xl bg-white"
//   />

//   <div className="absolute inset-0 bg-white/40 flex flex-col justify-center items-center text-black text-center px-4">
//     <h2 className="text-xl md:text-4xl font-bold">
//       Sell Your Products
//     </h2>

//     <Button
//       onClick={() => navigate("/become-seller")}
//       variant="contained"
//       startIcon={<StorefrontIcon />}
//       sx={{ mt: 2 }}
//     >
//       Become Seller
//     </Button>
//   </div>
// </section>

//       {/* ================= WHY US ================= */}
//       <section className="bg-gray-100 py-12">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold mb-10">
//             Why Choose Us?
//           </h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { icon: "🌱", title: "Fresh", desc: "Direct from farm" },
//               { icon: "🚜", title: "Farmers", desc: "No middleman" },
//               { icon: "🚚", title: "Fast Delivery", desc: "Quick delivery" },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
//               >
//                 <div className="text-3xl mb-2">{item.icon}</div>
//                 <h3 className="font-semibold text-lg">{item.title}</h3>
//                 <p className="text-gray-500 text-sm">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= CHAT BUTTON ================= */}
//       <div className="fixed bottom-6 right-6 z-50">
//         {showChatBot ? (
//           <ChatBot handleClose={() => setShowChatBot(false)} />
//         ) : (
//           <Button
//             onClick={() => setShowChatBot(true)}
//             variant="contained"
//             sx={{ borderRadius: "50%", width: 60, height: 60 }}
//           >
//             <ChatBubbleIcon />
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
import { useState, useEffect } from "react";
import ChatBot from "../ChatBot/ChatBot";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  Backdrop,
  Button,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { ChevronRight } from "lucide-react";
import { categories } from "../../../data/mockData";
import ProductCard from "../Products/ProductCard/ProductCard";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [showChatBot, setShowChatBot] = useState(false);

  // ✅ Category state
  const [selectedCategory, setSelectedCategory] = useState("all");

  const dispatch = useAppDispatch();
  // const { loading: homeLoading } = useAppSelector((store) => store.homePage);
  const { products, loading: productLoading } = useAppSelector(
    (store) => store.products
  );

  const navigate = useNavigate();

  // ✅ Initial load
  useEffect(() => {
    // dispatch(fetchHomePageData());

    dispatch(
      getAllProducts({
        pageNumber: 0,
      })
    );
  }, [dispatch]);

  // ✅ Category click handler (API filtering)
  const handleCategoryClick = (category:any) => {
    if (productLoading) return; // prevent spam clicks

    setSelectedCategory(category);

    dispatch(
      getAllProducts({
        category: category === "all" ? undefined : category,
        pageNumber: 0,
      })
    );
  };

  // ✅ Loader
  // if (homeLoading) {
  //   return (
  //     <Backdrop open>
  //       <CircularProgress />
  //     </Backdrop>
  //   );
  // }

  return (
    <div className="space-y-12">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-100 via-white to-green-50 py-14 md:py-20">
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-green-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-green-400 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 relative z-10">

          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm mb-4">
              🌱 100% Organic & Fresh
            </span>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
              Farm Fresh <br />
              <span className="text-[#00927c]">Delivered to You</span>
            </h1>

            <p className="mt-4 text-gray-600 text-sm md:text-lg">
              Directly from farmers to your home. No middleman, better prices, fresher food.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                onClick={() => navigate("/products")}
                variant="contained"
              >
                Shop Now
              </Button>

              <Button
                onClick={() => navigate("/become-seller")}
                variant="outlined"
              >
                Become Seller
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= CATEGORY ================= */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`bg-white p-4 rounded-xl shadow cursor-pointer text-center transition hover:-translate-y-1 
                ${
                  selectedCategory === cat.id
                    ? "border-2 border-green-500"
                    : ""
                }`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-sm font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Featured Products
          </h2>

          <Button onClick={() => navigate("/products")}>
            View All <ChevronRight />
          </Button>
        </div>

        {productLoading ? (
          <div className="text-center py-10">
            <CircularProgress />
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products
              .slice(0, isMobile ? 2 : 4)
              .map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <img
              src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
              className="w-60 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">No Products Found</h3>
          </div>
        )}
      </section>

      {/* ================= SELLER ================= */}
      <section className="relative h-[220px] md:h-[400px]">
        <img
          src="/seller-banner.png"
          className="w-full h-full object-contain md:object-cover rounded-xl bg-white"
        />

        <div className="absolute inset-0 bg-white/40 flex flex-col justify-center items-center text-black text-center">
          <h2 className="text-xl md:text-4xl font-bold">
            Sell Your Products
          </h2>

          <Button
            onClick={() => navigate("/become-seller")}
            variant="contained"
            startIcon={<StorefrontIcon />}
            sx={{ mt: 2 }}
          >
            Become Seller
          </Button>
        </div>
      </section>

      {/* ================= CHAT ================= */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChatBot ? (
          <ChatBot handleClose={() => setShowChatBot(false)} />
        ) : (
          <Button
            onClick={() => setShowChatBot(true)}
            variant="contained"
            sx={{ borderRadius: "50%", width: 60, height: 60 }}
          >
            <ChatBubbleIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Home;