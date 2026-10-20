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
  Receipt,
  Truck,
  Users,
  RotateCcw,
  Bell,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileText,
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
import { AppSidebar, type NavTab } from "@/components/layout/AppSidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SparkStock ERP | Electrical Wholesale & Retail Management" },
      {
        name: "description",
        content:
          "GST-compliant electrical business workbench with real-time inventory, POS billing, stock movement, and supplier purchase management.",
      },
      { property: "og:title", content: "SparkStock ERP" },
      {
        property: "og:description",
        content: "Complete Electrical Wholesale & Retail Inventory Workbench",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
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
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  // Form State for Adding Item
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
  const lowStockItems = products.filter((p) => p.stock <= p.minStock);
  const lowStockCount = lowStockItems.length;
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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <AppSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={null}
        onAuthClick={() => alert("Ready to connect with database & auth")}
        onSignOut={() => {}}
        lowStockCount={lowStockCount}
        pendingAlertsCount={lowStockCount}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Zap className="h-4 w-4" />
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white capitalize">
                {activeTab === "dashboard"
                  ? "Executive Workbench"
                  : activeTab === "inventory"
                  ? "Products & Master Catalog"
                  : activeTab === "billing"
                  ? "POS & Tax Invoicing (GST)"
                  : activeTab === "purchases"
                  ? "Inward Purchases & GRN"
                  : activeTab === "intelligence"
                  ? "Stock Velocity & Dead Stock"
                  : activeTab === "reorders"
                  ? "Smart Reorder Recommendations"
                  : activeTab === "parties"
                  ? "Customer & Supplier Khata"
                  : activeTab === "finance"
                  ? "Profit Margin & Operating Expenses"
                  : "Critical Business Alerts"}
              </h1>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-[10px]">
                GST Ready
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Real-time electrical distribution metrics with Indian GST compliance
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 gap-1.5 shadow-lg shadow-blue-600/20">
                  <Plus className="h-3.5 w-3.5" /> Add Electrical Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Register SKU with HSN code, opening stock, and GST rate.
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
        </div>

        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
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
                    <TrendingUp className="h-3 w-3 text-emerald-400" /> Across 5 categories
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
                  <p className="text-xs text-slate-400 mt-1">Real-time valuation</p>
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
                  <p className="text-xs text-slate-400 mt-1">Below minimum threshold</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/90 border-slate-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Today's Billing
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-indigo-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">₹0</div>
                  <p className="text-xs text-slate-400 mt-1">Ready for POS sales</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action & Urgent Restock Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-900/70 border-slate-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>Low Stock Watchlist</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-400 hover:text-blue-300 h-7"
                        onClick={() => setActiveTab("inventory")}
                      >
                        View All Items <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400">
                      Electrical items requiring supplier replenishment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-950/60">
                        <TableRow className="border-slate-800">
                          <TableHead className="text-xs text-slate-400">Item</TableHead>
                          <TableHead className="text-xs text-slate-400 text-right">Stock</TableHead>
                          <TableHead className="text-xs text-slate-400 text-right">Min Level</TableHead>
                          <TableHead className="text-xs text-slate-400 text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lowStockItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-xs text-slate-500">
                              All items are safely above minimum stock levels.
                            </TableCell>
                          </TableRow>
                        ) : (
                          lowStockItems.map((item) => (
                            <TableRow key={item.id} className="border-slate-800/60">
                              <TableCell className="text-xs font-medium text-white">{item.name}</TableCell>
                              <TableCell className="text-xs text-right text-amber-400 font-semibold">
                                {item.stock} {item.unit}
                              </TableCell>
                              <TableCell className="text-xs text-right text-slate-400">
                                {item.minStock} {item.unit}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[9px]">
                                  Reorder Needed
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Operation Launchpad */}
              <Card className="bg-slate-900/70 border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-white">ERP Quick Shortcuts</CardTitle>
                  <CardDescription className="text-xs text-slate-400">Fast access to daily store tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <Button
                    onClick={() => setActiveTab("billing")}
                    variant="outline"
                    className="w-full justify-between h-11 bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-emerald-400" /> New Counter Sale (POS)
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </Button>
                  <Button
                    onClick={() => setActiveTab("purchases")}
                    variant="outline"
                    className="w-full justify-between h-11 bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-400" /> Receive Inward Stock (GRN)
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </Button>
                  <Button
                    onClick={() => setActiveTab("parties")}
                    variant="outline"
                    className="w-full justify-between h-11 bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-indigo-400" /> Check Contractor Khata
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-slate-400" />
                  </Button>
                  <Button
                    onClick={() => setActiveTab("alerts")}
                    variant="outline"
                    className="w-full justify-between h-11 bg-slate-800/40 border-slate-700/80 hover:bg-slate-800 text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-amber-400" /> View Pending Alerts
                    </span>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-[10px]">
                      {lowStockCount}
                    </Badge>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & PRODUCTS */}
        {activeTab === "inventory" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search SKU name, HSN code, or brand..."
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

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="border-slate-800 hover:bg-slate-900">
                    <TableHead className="text-slate-400 font-medium">Item Description</TableHead>
                    <TableHead className="text-slate-400 font-medium">Category</TableHead>
                    <TableHead className="text-slate-400 font-medium">HSN</TableHead>
                    <TableHead className="text-slate-400 font-medium text-right">Available Stock</TableHead>
                    <TableHead className="text-slate-400 font-medium text-right">GST %</TableHead>
                    <TableHead className="text-slate-400 font-medium text-right">Selling Price</TableHead>
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
        )}

        {/* TAB 3: POS & GST BILLING */}
        {activeTab === "billing" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-400" /> POS Billing Terminal
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Create retail cash slips or B2B tax invoices with automated CGST + SGST or IGST breakdown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Customer Type</Label>
                  <select className="w-full h-9 rounded-md bg-slate-800 border border-slate-700 px-3 text-xs text-white">
                    <option>Walk-in Retail Cash</option>
                    <option>Contractor Account (Credit/Khata)</option>
                    <option>Registered GST Dealer (B2B Tax Invoice)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Invoice Number</Label>
                  <Input value="INV-2026-001" readOnly className="bg-slate-800/60 border-slate-700 text-xs text-slate-300 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Tax Type</Label>
                  <Input value="Intra-State (CGST 9% + SGST 9%)" readOnly className="bg-slate-800/60 border-slate-700 text-xs text-slate-300" />
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 p-8 text-center bg-slate-950/40 space-y-3">
                <FileText className="h-8 w-8 text-slate-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-medium text-slate-300">Ready for Line Items</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Select electrical SKUs from the catalog to generate instant tax receipts with auto-stock deduction.
                  </p>
                </div>
                <Button size="sm" onClick={() => setActiveTab("inventory")} className="bg-blue-600 hover:bg-blue-500 text-xs text-white">
                  Pick Items from Inventory
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: PURCHASES & INWARD */}
        {activeTab === "purchases" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-400" /> Goods Receiving Voucher (GRN)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Log supplier inward shipments to increment warehouse stock and record supplier bills.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Supplier / Distributor</Label>
                  <Input placeholder="e.g. Havells India Ltd Regional Depot" className="bg-slate-800 border-slate-700 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Supplier Bill Number</Label>
                  <Input placeholder="e.g. HVL-BIL-8921" className="bg-slate-800 border-slate-700 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Inward Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="bg-slate-800 border-slate-700 text-xs text-white" />
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 p-8 text-center bg-slate-950/40 space-y-3">
                <Truck className="h-8 w-8 text-slate-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-medium text-slate-300">No Pending Inward Vouchers</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Every inward entry updates stock levels with traceable audit movement records.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 5: STOCK INTELLIGENCE */}
        {activeTab === "intelligence" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" /> Fast-Moving SKUs (Top Velocity)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-slate-400">
                  Wires & Cables (Havells 2.5 sq mm) and 10A Modular Switches show the highest turnover in retail billing.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" /> Slow / Dead Stock Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-slate-400">
                  Changeover switches (63A 4-Pole) require monitoring; zero stock movement in the last 45 days.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 6: REORDER SUGGESTIONS */}
        {activeTab === "reorders" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-blue-400" /> Purchase Replenishment Recommendations
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                System suggestions generated from current stock levels and minimum thresholds. Never auto-ordered; reviewed by store manager.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-slate-950">
                  <TableRow className="border-slate-800">
                    <TableHead className="text-xs text-slate-400">Item</TableHead>
                    <TableHead className="text-xs text-slate-400 text-right">Current Stock</TableHead>
                    <TableHead className="text-xs text-slate-400 text-right">Suggested Qty</TableHead>
                    <TableHead className="text-xs text-slate-400 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id} className="border-slate-800/60">
                      <TableCell className="text-xs font-medium text-white">{item.name}</TableCell>
                      <TableCell className="text-xs text-right text-amber-400">{item.stock} {item.unit}</TableCell>
                      <TableCell className="text-xs text-right text-emerald-400 font-semibold">
                        +{item.minStock * 2 - item.stock} {item.unit}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="outline" className="h-7 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-950">
                          Create PO
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* TAB 7: PARTIES & KHATA */}
        {activeTab === "parties" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" /> Customer & Supplier Ledger (Khata)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Track pending receivables from electricians/contractors and payables to authorized distributors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Outstanding Receivables</span>
                  <div className="text-xl font-bold text-emerald-400">₹0.00</div>
                  <p className="text-xs text-slate-500">Contractors and credit accounts</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Pending Supplier Payables</span>
                  <div className="text-xl font-bold text-amber-400">₹0.00</div>
                  <p className="text-xs text-slate-500">Distributor credit terms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 8: PROFIT & EXPENSES */}
        {activeTab === "finance" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-emerald-400" /> Profit & Operating Expenses
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Gross margin calculations, freight charges, shop rent, and electricity bills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 text-center space-y-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-medium text-white">Daily Expense Register Ready</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Log daily store overheads (freight, packaging, labor) to view real net operating profit against GST sales.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 9: ALERTS & ACTIONS */}
        {activeTab === "alerts" && (
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-400" /> Action Center & Critical Alerts
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Actionable notifications requiring owner intervention.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        Low Stock Alert: {item.name}
                      </p>
                      <p className="text-[11px] text-amber-300/80">
                        Available: {item.stock} {item.unit} (Minimum: {item.minStock} {item.unit})
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab("reorders")}
                    className="h-7 text-xs bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
