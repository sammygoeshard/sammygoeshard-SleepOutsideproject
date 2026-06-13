import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        // add product listing and product details pages
        product_listing: resolve(__dirname, "src/product_listing/index.html"), 
        // dynamic product link
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
      },
    },
  },
);
