import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Music, Guitar, Headphones } from "lucide-react";

const ProductCard = ({
  product,
  showActions = false,
  onStartEdit,
  onDeleteProduct,
  onAddToCart,
  formatPrice,
}) => (
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
          <span className="text-2xl font-bold">
            {formatPrice(product.price)}
          </span>
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
            onClick={() => onStartEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteProduct(product.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button onClick={() => onAddToCart(product)} className="w-full">
          Add to Cart
        </Button>
      )}
    </CardFooter>
  </Card>
);

export default ProductCard;
