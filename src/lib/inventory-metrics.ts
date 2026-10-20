import type { Database } from "@/integrations/supabase/types";

export type InventoryMetricProduct = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  "stock_qty" | "minimum_stock" | "reorder_level" | "purchase_price" | "status"
>;

export function getInventoryMetrics(products: InventoryMetricProduct[]) {
  const activeProducts = products.filter((product) => product.status === "active");
  const reorderProducts = activeProducts.filter(
    (product) =>
      product.stock_qty === 0 ||
      product.stock_qty <= Math.max(product.minimum_stock, product.reorder_level),
  );

  return {
    activeSkuCount: activeProducts.length,
    inventoryCost: products.reduce(
      (total, product) => total + product.stock_qty * product.purchase_price,
      0,
    ),
    onHandUnits: products.reduce((total, product) => total + product.stock_qty, 0),
    reorderCount: reorderProducts.length,
    reorderProducts,
  };
}