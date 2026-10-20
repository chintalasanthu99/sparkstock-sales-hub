import { describe, expect, it } from "vitest";

import { getInventoryMetrics, type InventoryMetricProduct } from "@/lib/inventory-metrics";

const product = (overrides: Partial<InventoryMetricProduct>): InventoryMetricProduct => ({
  stock_qty: 0,
  minimum_stock: 0,
  reorder_level: 0,
  purchase_price: 0,
  status: "active",
  ...overrides,
});

describe("getInventoryMetrics", () => {
  it("returns zero-valued metrics for an empty catalog", () => {
    expect(getInventoryMetrics([])).toMatchObject({
      activeSkuCount: 0,
      inventoryCost: 0,
      onHandUnits: 0,
      reorderCount: 0,
    });
  });

  it("values stock at purchase cost and excludes discontinued items from reorder alerts", () => {
    const metrics = getInventoryMetrics([
      product({ stock_qty: 4, minimum_stock: 2, reorder_level: 3, purchase_price: 10 }),
      product({ stock_qty: 0, purchase_price: 25 }),
      product({ stock_qty: 2, purchase_price: 100, status: "discontinued" }),
    ]);

    expect(metrics).toMatchObject({
      activeSkuCount: 2,
      inventoryCost: 240,
      onHandUnits: 6,
      reorderCount: 1,
    });
  });
});