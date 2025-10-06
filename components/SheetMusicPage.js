import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import ProductCard from "./ProductCard";

const SheetMusicPage = ({
  searchTerm,
  setSearchTerm,
  isAdmin,
  setShowProductDialog,
  getProductsByCategory,
  onStartEdit,
  onDeleteProduct,
  onAddToCart,
}) => (
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
          onStartEdit={onStartEdit}
          onDeleteProduct={onDeleteProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  </div>
);

export default SheetMusicPage;
