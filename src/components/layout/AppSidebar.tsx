import React from "react";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Truck,
  Users,
  TrendingUp,
  RotateCcw,
  IndianRupee,
  Bell,
  Zap,
  LogOut,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type NavTab =
  | "dashboard"
  | "inventory"
  | "billing"
  | "purchases"
  | "parties"
  | "intelligence"
  | "reorders"
  | "finance"
  | "alerts";

interface AppSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: any;
  onAuthClick: () => void;
  onSignOut: () => void;
  lowStockCount?: number;
  pendingAlertsCount?: number;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  user,
  onAuthClick,
  onSignOut,
  lowStockCount = 0,
  pendingAlertsCount = 0,
}: AppSidebarProps) {
  const sections = [
    {
      title: "Core Operations",
      items: [
        {
          id: "dashboard" as NavTab,
          label: "Executive Dashboard",
          icon: LayoutDashboard,
        },
        {
          id: "inventory" as NavTab,
          label: "Products & Stock",
          icon: Package,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
          badgeVariant: "amber",
        },
        {
          id: "billing" as NavTab,
          label: "POS & GST Billing",
          icon: Receipt,
        },
        {
          id: "purchases" as NavTab,
          label: "Purchases & Inward",
          icon: Truck,
        },
      ],
    },
    {
      title: "Stock Intelligence",
      items: [
        {
          id: "intelligence" as NavTab,
          label: "Movement & Dead Stock",
          icon: TrendingUp,
        },
        {
          id: "reorders" as NavTab,
          label: "Reorder Suggestions",
          icon: RotateCcw,
        },
      ],
    },
    {
      title: "Parties & Finance",
      items: [
        {
          id: "parties" as NavTab,
          label: "Customer & Supplier Khata",
          icon: Users,
        },
        {
          id: "finance" as NavTab,
          label: "Profit & Expenses",
          icon: IndianRupee,
        },
        {
          id: "alerts" as NavTab,
          label: "Alerts & Actions",
          icon: Bell,
          badge: pendingAlertsCount > 0 ? `${pendingAlertsCount}` : undefined,
          badgeVariant: "red",
        },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0 h-auto md:h-screen sticky top-0">
      {/* Brand & Store Header */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white tracking-tight text-base truncate">
                  SparkStock
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  ERP
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">Electrical Wholesale & Retail</p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="p-3 space-y-5 flex-1">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 ${
                          item.badgeVariant === "amber"
                            ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                            : "border-red-500/30 text-red-400 bg-red-500/10"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer: User / Auth Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950">
        {user ? (
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">{user.email}</p>
                <p className="text-[10px] text-slate-500">Store Owner • GSTIN Active</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="w-full h-7 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/20"
            >
              <LogOut className="h-3 w-3 mr-1.5" /> Log Out
            </Button>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20 space-y-2">
            <p className="text-xs text-blue-300">Sync with database</p>
            <Button
              size="sm"
              onClick={onAuthClick}
              className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" /> Sign In
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
