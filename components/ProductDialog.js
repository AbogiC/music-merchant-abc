import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductDialog = ({
  showProductDialog,
  setShowProductDialog,
  editingProduct,
  setEditingProduct,
  productForm,
  setProductForm,
  handleProductSubmit,
}) => (
  <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogDescription>Fill in the product details below</DialogDescription>
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

export default ProductDialog;
