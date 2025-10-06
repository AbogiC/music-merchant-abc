import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Home,
  Music2,
  Guitar,
  Smartphone,
  User,
  ShoppingCart,
  Menu,
} from "lucide-react";

const Navbar = ({ currentPage, setCurrentPage, cart, isAdmin, setIsAdmin }) => {
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

export default Navbar;
