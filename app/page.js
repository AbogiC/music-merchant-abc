"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Music,
  Guitar,
  Piano,
  Violin,
  ShoppingCart,
  User,
  Home,
  Smartphone,
  Search,
  Plus,
  Edit,
  Trash,
  Star,
  Music2,
  Headphones,
  Monitor,
  Settings,
  Package,
  Menu,
} from "lucide-react";

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

  const Navbar = () => {
    const mainNavItems = [
      { label: "Home", icon: Home, page: "home" },
      { label: "Sheet Music", icon: Music2, page: "sheet-music" },
      { label: "Equipment & Accessories", icon: Guitar, page: "equipment" },
      { label: "App & Services", icon: Smartphone, page: "services" },
      { label: "Profile", icon: User, page: "profile" },
    ];

    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MusicMerchant</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.page}
                variant={currentPage === item.page ? "default" : "ghost"}
                onClick={() => setCurrentPage(item.page)}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
            <Button
              variant={currentPage === "cart" ? "default" : "ghost"}
              onClick={() => setCurrentPage("cart")}
              className="flex items-center space-x-2 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
            <Button
              variant={isAdmin ? "destructive" : "outline"}
              onClick={() => setIsAdmin(!isAdmin)}
              className="ml-4"
            >
              {isAdmin ? "Exit Admin" : "Admin Mode"}
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-2 mt-8">
                {mainNavItems.map((item) => (
                  <Button
                    key={item.page}
                    variant={currentPage === item.page ? "default" : "ghost"}
                    onClick={() => setCurrentPage(item.page)}
                    className="justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant={currentPage === "cart" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("cart")}
                  className="justify-start relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={isAdmin ? "destructive" : "outline"}
                  onClick={() => setIsAdmin(!isAdmin)}
                  className="justify-start"
                >
                  {isAdmin ? "Exit Admin" : "Admin Mode"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    );
  };

  const ProductCard = ({ product, showActions = false }) => (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-muted-foreground">
              {product.category === "sheet-music" && (
                <Music className="h-12 w-12" />
              )}
              {product.category === "instruments" && (
                <Guitar className="h-12 w-12" />
              )}
              {product.category === "accessories" && (
                <Headphones className="h-12 w-12" />
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
            <Badge variant="secondary">{product.type}</Badge>
          </div>
          {product.composer && (
            <p className="text-sm text-muted-foreground">
              Composer: {product.composer}
            </p>
          )}
          {product.difficulty && (
            <Badge variant="outline">{product.difficulty}</Badge>
          )}
          {product.brand && (
            <p className="text-sm text-muted-foreground">
              Brand: {product.brand}
            </p>
          )}
          {product.genre && <Badge variant="outline">{product.genre}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {showActions ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteProduct(product.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => addToCart(product)} className="w-full">
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  const HomePage = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Musical Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover thousands of sheet music pieces, quality instruments, and
            professional accessories to elevate your musical performance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => setCurrentPage("sheet-music")}>
              Browse Sheet Music
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setCurrentPage("equipment")}
            >
              Shop Instruments
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentPage("sheet-music")}
          >
            <CardHeader className="text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle>Sheet Music</CardTitle>
              <CardDescription>Classical, Jazz, Pop, and more</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentPage("equipment")}
          >
            <CardHeader className="text-center">
              <Guitar className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle>Instruments</CardTitle>
              <CardDescription>
                Guitars, Pianos, Violins, and more
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentPage("equipment")}
          >
            <CardHeader className="text-center">
              <Headphones className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle>Accessories</CardTitle>
              <CardDescription>Cases, Stands, Audio equipment</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );

  const SheetMusicPage = () => (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sheet Music Collection</h1>
          <p className="text-muted-foreground">
            Discover thousands of sheet music pieces for all skill levels
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sheet music..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          {isAdmin && (
            <Button onClick={() => setShowProductDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getProductsByCategory("sheet-music").map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showActions={isAdmin}
          />
        ))}
      </div>
    </div>
  );

  const EquipmentPage = () => (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Equipment & Accessories</h1>
          <p className="text-muted-foreground">
            Professional instruments and accessories for musicians
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          {isAdmin && (
            <Button onClick={() => setShowProductDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="instruments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>

        <TabsContent value="instruments">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getProductsByCategory("instruments").map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={isAdmin}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accessories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getProductsByCategory("accessories").map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={isAdmin}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const ServicesPage = () => (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Apps & Services</h1>
        <p className="text-muted-foreground">
          Digital tools and services to enhance your musical journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Music Learning App</CardTitle>
            <CardDescription>
              Interactive lessons and practice tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Step-by-step tutorials</li>
              <li>• Real-time feedback</li>
              <li>• Progress tracking</li>
              <li>• Metronome & tuner</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Download App - $9.99/month</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Virtual Lessons</CardTitle>
            <CardDescription>
              One-on-one instruction with professional teachers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Certified instructors</li>
              <li>• Flexible scheduling</li>
              <li>• All skill levels</li>
              <li>• Multiple instruments</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Book Lesson - $50/hour</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Instrument Repair</CardTitle>
            <CardDescription>
              Professional maintenance and repair services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Expert technicians</li>
              <li>• Quick turnaround</li>
              <li>• Quality guarantee</li>
              <li>• Pickup & delivery</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Schedule Service</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Authentication is not enabled yet. In the future, you'll be able
                to:
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Save your favorite products</li>
                <li>• Track order history</li>
                <li>• Manage shipping addresses</li>
                <li>• Set preferences</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopping History</CardTitle>
              <CardDescription>View your recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Current cart contents:
              </p>
              {cart.length > 0 ? (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your cart is empty
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const CartPage = () => (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add some products to get started!
            </p>
            <Button onClick={() => setCurrentPage("home")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        {item.category === "sheet-music" && (
                          <Music className="h-8 w-8" />
                        )}
                        {item.category === "instruments" && (
                          <Guitar className="h-8 w-8" />
                        )}
                        {item.category === "accessories" && (
                          <Headphones className="h-8 w-8" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="text-lg font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$5.99</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${(cartTotal + 5.99).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ProductDialog = () => (
    <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            Fill in the product details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) =>
                  setProductForm({ ...productForm, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sheet-music">Sheet Music</SelectItem>
                  <SelectItem value="instruments">Instruments</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={productForm.type}
                onChange={(e) =>
                  setProductForm({ ...productForm, type: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={productForm.image}
              onChange={(e) =>
                setProductForm({ ...productForm, image: e.target.value })
              }
            />
          </div>

          {productForm.category === "sheet-music" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="composer">Composer</Label>
                <Input
                  id="composer"
                  value={productForm.composer}
                  onChange={(e) =>
                    setProductForm({ ...productForm, composer: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={productForm.difficulty}
                  onValueChange={(value) =>
                    setProductForm({ ...productForm, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={productForm.genre}
                  onChange={(e) =>
                    setProductForm({ ...productForm, genre: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {(productForm.category === "instruments" ||
            productForm.category === "accessories") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={productForm.brand}
                  onChange={(e) =>
                    setProductForm({ ...productForm, brand: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={productForm.model}
                  onChange={(e) =>
                    setProductForm({ ...productForm, model: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowProductDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "sheet-music":
        return <SheetMusicPage />;
      case "equipment":
        return <EquipmentPage />;
      case "services":
        return <ServicesPage />;
      case "profile":
        return <ProfilePage />;
      case "cart":
        return <CartPage />;
      default:
        return <HomePage />;
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
      <Navbar />
      <main>{renderCurrentPage()}</main>
      <ProductDialog />
    </div>
  );
}
