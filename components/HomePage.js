import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Guitar, Headphones } from "lucide-react";
import ProductCard from "./ProductCard";

const HomePage = ({ setCurrentPage, products, onAddToCart, formatPrice }) => (
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
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            formatPrice={formatPrice}
          />
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

export default HomePage;
