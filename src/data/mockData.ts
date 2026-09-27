import { FarmerRegistration, InventoryItem, DBTTransaction, KendraKPIs } from '../types';

export const INITIAL_KPIS: KendraKPIs = {
  preRegistrationsToday: 0,
  ureaIssuedBags: 0,
  pendingApprovals: 0,
  bufferStockBags: 12400,
  targetQuotaBags: 4000,
  consumedQuotaBags: 0,
};

// Clean state: Zero dummy farmer registrations (ready for new live registrations)
export const INITIAL_REGISTRATIONS: FarmerRegistration[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-01',
    name: 'IFFCO Neem Coated Urea (Granular)',
    nameHindi: 'इफको नीम लेपित यूरिया (दानेदार)',
    sku: 'IFFCO-UREA-45KG',
    packSize: '45 Kg Bag',
    mrpRate: 2416.50,
    subsidizedRate: 266.50,
    govtSubsidy: 2150.00,
    stockInHand: 4250,
    bufferStock: 12400,
    allocatedToday: 0,
    unit: 'Bags',
    warehouseLocation: 'Sardhana Warehouse #104 Stacks A1-B4',
    reorderLevel: 2500,
  },
  {
    id: 'INV-02',
    name: 'IFFCO Nano Urea Liquid (Biotech)',
    nameHindi: 'इफको नैनो यूरिया तरल',
    sku: 'IFFCO-NANO-500ML',
    packSize: '500 mL Bottle',
    mrpRate: 225.00,
    subsidizedRate: 225.00,
    govtSubsidy: 0,
    stockInHand: 3180,
    bufferStock: 8000,
    allocatedToday: 0,
    unit: 'Bottles',
    warehouseLocation: 'Depot Cold Storage Bay #2',
    reorderLevel: 1000,
  },
  {
    id: 'INV-03',
    name: 'IFFCO DAP (Di-Ammonium Phosphate 18:46:0)',
    nameHindi: 'इफको डीएपी 18:46:0',
    sku: 'IFFCO-DAP-50KG',
    packSize: '50 Kg Bag',
    mrpRate: 4000.00,
    subsidizedRate: 1350.00,
    govtSubsidy: 2650.00,
    stockInHand: 1850,
    bufferStock: 5200,
    allocatedToday: 0,
    unit: 'Bags',
    warehouseLocation: 'Sardhana Central Depot #104 Stack C1',
    reorderLevel: 1200,
  },
  {
    id: 'INV-04',
    name: 'IFFCO NPK (Complex Fertilizer 12:32:16)',
    nameHindi: 'इफको एनपीके 12:32:16',
    sku: 'IFFCO-NPK-50KG',
    packSize: '50 Kg Bag',
    mrpRate: 3450.00,
    subsidizedRate: 1470.00,
    govtSubsidy: 1980.00,
    stockInHand: 1420,
    bufferStock: 3500,
    allocatedToday: 0,
    unit: 'Bags',
    warehouseLocation: 'Meerut Railway Siding Shed #3',
    reorderLevel: 800,
  }
];

// Clean state: Zero dummy DBT settlement records
export const INITIAL_DBT_LOGS: DBTTransaction[] = [];
