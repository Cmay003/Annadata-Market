

import {
  Facebook,
  Instagram,
  Twitter,
  YouTube,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">Annadata Market 🌾</h2>
          <p className="mt-3 text-sm">
            Connecting farmers directly to consumers. Fresh, organic, and trusted products at your doorstep.
          </p>
        </div>

        {/* Customer Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">For Customers</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/products" className="hover:text-white">Shop</a></li>
            <li><a href="/cart" className="hover:text-white">Cart</a></li>
            <li><a href="/account/orders" className="hover:text-white">Orders</a></li>
          </ul>
        </div>

        {/* Farmer Links
        <div>
          <h3 className="text-white font-semibold mb-3">For Farmers</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Sell Products</a></li>
            <li><a href="/" className="hover:text-white">Dashboard</a></li>
            <li><a href="/" className="hover:text-white">Add Product</a></li>
            <li><a href="/" className="hover:text-white">Orders</a></li>
          </ul>
        </div> */}

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">📍 Uttarakhand, India</p>
          <p className="text-sm">📧 support@annadatamarket.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>

          <div className="flex gap-4 mt-4">
            <Facebook className="cursor-pointer hover:text-white" />
            <Instagram className="cursor-pointer hover:text-white" />
            <Twitter className="cursor-pointer hover:text-white" />
            <YouTube className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} Annadata Market. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;