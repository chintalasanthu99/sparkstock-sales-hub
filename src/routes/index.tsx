import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Package,
  AlertTriangle,
  IndianRupee,
  Plus,
  Search,
  Zap,
  TrendingUp,
  Layers,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export const Route = createFileRoute("/")({
  component: DashboardIndex,
});

interface Product {
  id: string;
  name: string;
  category: string;
  hsn: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  gst: number;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Havells 2.5 sq mm FR PVC Copper Wire (90m)",
    category: "Wires & Cables",
    hsn: "8544",
    stock: 45,
    minStock: 20,
    unit: "Rolls",
    price: 2450,
    gst: 18,
  },
  {
    id: "2",
    name: "Schneider Acti9 16A Single Pole MCB C-Curve",
    category: "Switchgear",
    hsn: "8536",
    stock: 8,
    minStock: 15,
    unit: "Pcs",
    price: 280,
    gst: 18,
  },
  {
    id: "3",
    name: "Philips 12W LED Round Downlight Warm White",
    category: "Lighting",
    hsn: "9405",
    stock: 120,
    minStock: 30,
    unit: "Pcs",
    price: 360,
    gst: 12,
  },
  {
    id: "4",
    name: "Legrand Arteor 10A 1-Way Modular Switch",
    category: "Modular Switches",
    hsn: "8536",
    stock: 240,
    minStock: 50,
    unit: "Pcs",
    price: 115,
    gst: 18,
  },
  {
    id: "5",
    name: "Polycab 4 sq mm 3 Core Submersible Flat Cable",
    category: "Wires & Cables",
    hsn: "8544",
    stock: 4,
    minStock: 10,
    unit: "Mtr",
    price: 185,
    gst: 18,
  },
  {
    id: "6",
    name: "L&T 63A 4-Pole Changeover Switch",
    category: "Switchgear",
    hsn: "8536",
    stock: 12,
    minStock: 5,
    unit: "Pcs",
    price: 3850,
    gst: 18,
  },
];

function DashboardIndex() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Wires & Cables",
    hsn: "8544",
    stock: 10,
    minStock: 5,
    unit: "Pcs",
    price: 500,
    gst: 18,
  });

  const categories = ["All", "Wires & Cables", "Switchgear", "Lighting", "Modular Switches"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hsn.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalStockValuation = products.reduce((acc, curr) => acc + curr.stock * curr.price, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newProd: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      hsn: formData.hsn,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      unit: formData.unit,
      price: Number(formData.price),
      gst: Number(formData.gst),
    };

    setProducts([newProd, ...products]);
    setIsOpen(false);
    setFormData({
      name: "",
      category: "Wires & Cables",
      hsn: "8544",
      stock: 10,
      minStock: 5,
      unit: "Pcs",
      price: 500,
      gst: 18,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Zap className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              SparkStock Enterprise
            </h1>
            <Badge variant="outline" className="border-blue-500/40 text-blue-400 text-xs">
              GST Ready
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            Electrical Wholesale & Retail Inventory Management
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2 shadow-lg shadow-blue-600/20">
              <Plus className="h-4 w-4" /> Add Electrical Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription className="text-slate-400">
                Register an electrical SKU with HSN code and GST tax slab.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4 py-2">
              <div className="space-y-1">
                <Label htmlFor="name">Item / Brand Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Havells 4 sq mm FR Wire"
                  className="bg-slate-800/80 border-slate-700 text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Wires & Cables">Wires & Cables</option>
                    <option value="Switchgear">Switchgear</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Modular Switches">Modular Switches</option>
                    <option value="Conduit & Pipes">Conduit & Pipes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="hsn">HSN Code</Label>
                  <Input
                    id="hsn"
                    placeholder="8544"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.hsn}
                    onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="stock">Opening Qty</Label>
                  <Input
                    id="stock"
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="Pcs/Rolls"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="price">Selling Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="gst">GST %</Label>
                  <select
                    id="gst"
                    className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 px-3 text-sm text-white"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
                  >
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white">
                  Save Item
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/90 border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total SKUs
            </CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" /> Active in database
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Inventory Value
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ₹{totalStockValuation.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-400 mt-1">Based on current selling price</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{lowStockCount}</div>
            <p className="text-xs text-slate-400 mt-1">Needs purchase re-order</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/90 border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
            <p className="text-xs text-slate-400 mt-1">Wires, Switchgear, Lighting</p>
          </CardContent>
        </Card>
      </div>

      {/* Catalog & Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by SKU name, HSN code, or category..."
              className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-3.5 w-3.5 text-slate-500 mr-1" />
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "secondary" : "ghost"}
                className={`text-xs h-8 px-2.5 ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="text-slate-400 font-medium">Item Description</TableHead>
                <TableHead className="text-slate-400 font-medium">Category</TableHead>
                <TableHead className="text-slate-400 font-medium">HSN</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Available Stock</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">GST %</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Price (₹)</TableHead>
                <TableHead className="text-slate-400 font-medium text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    No matching electrical items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <TableRow key={p.id} className="border-slate-800/60 hover:bg-slate-800/40">
                      <TableCell className="font-medium text-white">{p.name}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{p.hsn}</TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={isLow ? "text-amber-400 font-semibold" : "text-slate-200"}>
                          {p.stock} {p.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-400 text-xs">{p.gst}%</TableCell>
                      <TableCell className="text-right font-medium text-white">
                        ₹{p.price.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-center">
                        {isLow ? (
                          <Badge variant="destructive" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
