import React from 'react';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle2
} from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryDepotViewProps {
  inventory: InventoryItem[];
}

export const InventoryDepotView: React.FC<InventoryDepotViewProps> = ({ inventory }) => {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase border border-emerald-200">
                DEPOT & WAREHOUSE LIVE LEDGER
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-600 font-medium">Sardhana Central Depot #104</span>
            </div>
            <h2 className="text-2xl font-black text-[#1b431c] tracking-tight">
              भंडार एवं डिपो स्टॉक / Inventory & Depot
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Real-time sovereign fertilizer inventory, buffer reserve allocations, and railway rake shipments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#f0f7f1] border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#1b5e20] text-white flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-900 uppercase">Buffer Stock Reserve</p>
                <p className="text-sm font-black text-stone-900">12,400 Bags</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const isLow = item.stockInHand <= item.reorderLevel;
          const stockPercent = Math.min(100, Math.round((item.stockInHand / (item.stockInHand + item.allocatedToday)) * 100));

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-stone-200/90 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    {item.sku}
                  </span>
                  {isLow ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Sufficient
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-stone-900 mt-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-blue-900 font-semibold">{item.nameHindi}</p>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">Pack: {item.packSize}</p>

                <div className="mt-3 pt-2 border-t border-stone-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500">In Hand:</span>
                    <span className="text-lg font-black text-stone-900">
                      {item.stockInHand.toLocaleString()} <span className="text-xs font-normal text-stone-500">{item.unit}</span>
                    </span>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isLow ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 bg-stone-50 p-2.5 rounded text-[11px] border border-stone-100 mt-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subsidized MRP:</span>
                  <span className="font-extrabold text-stone-900">₹{item.subsidizedRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Govt Subsidy:</span>
                  <span className="font-bold text-emerald-800">₹{item.govtSubsidy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600 border-t border-stone-200 pt-1">
                  <span>Issued Today:</span>
                  <span className="font-bold">{item.allocatedToday.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incoming Freight Rakes & Siding Movement */}
      <div className="bg-white rounded-lg border border-stone-200/90 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
          <Truck className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-extrabold text-stone-900">
            Incoming Railway Rake Shipments & Siding Trackers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#fcfdfa] border border-stone-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-stone-900">Rake #KR-9842 (IFFCO Aonla Plant to Meerut Siding)</span>
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                Arrived & Unloading
              </span>
            </div>
            <p className="text-stone-600">
              Cargo: <strong>2,600 Metric Tonnes (57,700 Bags)</strong> Neem Coated Urea
            </p>
            <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              <span>Wagons: 42 BCN</span>
              <span>•</span>
              <span>Dispatched to Sardhana, Mawana & Daurala</span>
            </div>
          </div>

          <div className="bg-[#fcfdfa] border border-stone-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-stone-900">Rake #KR-9845 (IFFCO Kalol Plant - Nano Urea)</span>
              <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-bold">
                In Transit (ETA: 26 Feb)
              </span>
            </div>
            <p className="text-stone-600">
              Cargo: <strong>48,000 Bottles</strong> Nano Urea 500ml liquid spray containers
            </p>
            <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              <span>Route: Western Dedicated Freight Corridor</span>
              <span>•</span>
              <span>Consignee: Meerut Central Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
