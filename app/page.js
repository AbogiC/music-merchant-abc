"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import HomePage from "@/components/HomePage";
import SheetMusicPage from "@/components/SheetMusicPage";
import EquipmentPage from "@/components/EquipmentPage";
import ServicesPage from "@/components/ServicesPage";
import ProfilePage from "@/components/ProfilePage";
import CartPage from "@/components/CartPage";
import ProductDialog from "@/components/ProductDialog";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    image: "",
    composer: "",
    difficulty: "",
    genre: "",
    brand: "",
    model: "",
  });

  useEffect(() => {
    fetchProducts();
    startProcessPayment();
    // Load cart from localStorage
    const savedCart = localStorage.getItem("musicMerchantCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const startProcessPayment = async () => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem("musicMerchantCart", JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    localStorage.setItem("musicMerchantCart", JSON.stringify(newCart));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem("musicMerchantCart", JSON.stringify(newCart));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        fetchProducts();
        setShowProductDialog(false);
        setEditingProduct(null);
        setProductForm({
          name: "",
          description: "",
          price: "",
          category: "",
          type: "",
          image: "",
          composer: "",
          difficulty: "",
          genre: "",
          brand: "",
          model: "",
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductDialog(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.composer &&
        product.composer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand &&
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProductsByCategory = (category) => {
    return filteredProducts.filter((product) => product.category === category);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkout = async () => {
    const data = {
      id: "1",
      productName: "Test Checkout",
      price: 150000,
      quantity: "1",
    };

    const response = await fetch("/api/tokenizer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const requestData = await response.json();
    window.snap.pay(requestData.token);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            products={products}
            onAddToCart={addToCart}
          />
        );
      case "sheet-music":
        return (
          <SheetMusicPage
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isAdmin={isAdmin}
            setShowProductDialog={setShowProductDialog}
            getProductsByCategory={getProductsByCategory}
            onStartEdit={startEdit}
            onDeleteProduct={deleteProduct}
            onAddToCart={addToCart}
          />
        );
      case "equipment":
        return (
          <EquipmentPage
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isAdmin={isAdmin}
            setShowProductDialog={setShowProductDialog}
            getProductsByCategory={getProductsByCategory}
            onStartEdit={startEdit}
            onDeleteProduct={deleteProduct}
            onAddToCart={addToCart}
          />
        );
      case "services":
        return <ServicesPage />;
      case "profile":
        return <ProfilePage cart={cart} setCurrentPage={setCurrentPage} />;
      case "cart":
        return (
          <CartPage
            cart={cart}
            setCurrentPage={setCurrentPage}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            checkout={checkout}
            cartTotal={cartTotal}
          />
        );
      default:
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            products={products}
            onAddToCart={addToCart}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Music className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading MusicMerchant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cart={cart}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
      <main>{renderCurrentPage()}</main>
      <ProductDialog
        showProductDialog={showProductDialog}
        setShowProductDialog={setShowProductDialog}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        handleProductSubmit={handleProductSubmit}
      />
    </div>
  );
}
