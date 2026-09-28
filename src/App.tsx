/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { FarmerRegistrationView } from './components/FarmerRegistrationView';
import { StatusApprovalsView } from './components/StatusApprovalsView';
import { IssuanceCounterView } from './components/IssuanceCounterView';
import { InventoryDepotView } from './components/InventoryDepotView';
import { ReportsLogsView } from './components/ReportsLogsView';
import { OperatorManagementView } from './components/OperatorManagementView';
import { PaymentModal } from './components/PaymentModal';
import { TokenModal } from './components/TokenModal';
import { WipeCacheModal } from './components/WipeCacheModal';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';

import {
  INITIAL_KPIS,
  INITIAL_INVENTORY,
  INITIAL_DBT_LOGS,
} from './data/mockData';
import {
  FarmerRegistration,
  ActiveTab,
  KendraKPIs,
  InventoryItem,
  DBTTransaction,
  OperatorAccount,
  UserRole,
} from './types';
import {
  getOrCreateSystemMacAddress,
  getInitialOperators,
  saveOperators,
} from './utils/deviceSecurity';
import {
  getStoredFarmers,
  appendStoredFarmer,
  updateFarmerInStorage,
  computeFarmersKPIs,
  fetchFarmersFromWebhook,
} from './utils/farmerService';

export default function App() {
  // System NIC Hardware Identifier (MAC Address)
  const [currentMac] = useState<string>(() => getOrCreateSystemMacAddress());

  // Operators List (managed by Admin)
  const [operators, setOperators] = useState<OperatorAccount[]>(() => getInitialOperators());

  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kendra_auth') === 'true';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('kendra_role') as UserRole) || 'admin';
  });

  const [officerName, setOfficerName] = useState<string>(() => {
    return localStorage.getItem('kendra_officer') || 'Dr. Rajesh Sharma (Nodal Admin)';
  });

  // Active navigation tab
  // Admin only does approval, operator only does farmer registration
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const savedRole = localStorage.getItem('kendra_role');
    return savedRole === 'operator' ? 'farmer-registration' : 'status-approvals';
  });

  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Application state (JSON-backed records from repo and local cache)
  const [registrations, setRegistrations] = useState<FarmerRegistration[]>(() => getStoredFarmers());
  const [kpis, setKpis] = useState<KendraKPIs>(() => {
    const initialFarmers = getStoredFarmers();
    const computed = computeFarmersKPIs(initialFarmers);
    return {
      ...INITIAL_KPIS,
      ...computed,
    };
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<DBTTransaction[]>(INITIAL_DBT_LOGS);

  // Active modal for newly generated token slip
  const [newlyRegisteredFarmer, setNewlyRegisteredFarmer] = useState<FarmerRegistration | null>(null);

  // Active modal for payment before token issuance
  const [pendingPaymentFarmer, setPendingPaymentFarmer] = useState<FarmerRegistration | null>(null);
  const [paymentTxnRef, setPaymentTxnRef] = useState<string>('');
  const [formResetKey, setFormResetKey] = useState<number>(0);

  // Direct hand-off from Status view to Issuance Counter
  const [farmerForIssuance, setFarmerForIssuance] = useState<FarmerRegistration | null>(null);

  // Admin Wipe Cache Modal state - visible ONLY after Admin login
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);

  // On mount or when authenticated, fetch from webhook, clear old cache, and map only with API response
  useEffect(() => {
    if (isAuthenticated) {
      fetchFarmersFromWebhook().then((res) => {
        if (res.success) {
          setRegistrations(res.records);
          const dynamicKPIs = computeFarmersKPIs(res.records);
          setKpis((prev) => ({
            ...prev,
            ...dynamicKPIs,
          }));
        }
      });
    }
  }, [isAuthenticated]);

  // Operator Management Handlers (Admin action to add operator with MAC and details)
  const handleAddOperator = (operatorData: Omit<OperatorAccount, 'id' | 'createdAt'>) => {
    const newOp: OperatorAccount = {
      ...operatorData,
      id: `OP-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newOp, ...operators];
    setOperators(updated);
    saveOperators(updated);
  };

  const handleToggleOperatorStatus = (id: string) => {
    const updated = operators.map((op) =>
      op.id === id
        ? { ...op, status: (op.status === 'Active' ? 'Suspended' : 'Active') as 'Active' | 'Suspended' }
        : op
    );
    setOperators(updated);
    saveOperators(updated);
  };

  const handleDeleteOperator = (id: string) => {
    const updated = operators.filter((op) => op.id !== id);
    setOperators(updated);
    saveOperators(updated);
  };

  const handleUpdateOperatorMac = (id: string, newMac: string) => {
    const updated = operators.map((op) =>
      op.id === id ? { ...op, macAddress: newMac } : op
    );
    setOperators(updated);
    saveOperators(updated);
  };

  // Perform Wipe Cache - Admin Login Only
  const handleAdminConfirmWipe = (resetOperators: boolean) => {
    // Purge temporary browser session caches
    sessionStorage.clear();
    localStorage.removeItem('pm_kendra_registrations');
    localStorage.removeItem('pm_kendra_transactions');
    localStorage.removeItem('pm_kendra_form_draft');

    if (resetOperators) {
      localStorage.removeItem('pm_kendra_operators_list');
      setOperators(getInitialOperators());
    }

    // Reset runtime application cache & queues back to JSON default
    localStorage.removeItem('pm_kendra_farmers_json');
    const defaults = getStoredFarmers();
    setRegistrations(defaults);
    setTransactions([]);
    const dynamicKPIs = computeFarmersKPIs(defaults);
    setKpis({
      ...INITIAL_KPIS,
      ...dynamicKPIs,
    });
    setNewlyRegisteredFarmer(null);
    setFarmerForIssuance(null);
  };

  // Handle successful Kisan registration by Operator
  const handleRegisterSuccess = (farmer: FarmerRegistration) => {
    // Add new row into local JSON cache (avoids hitting the API GET endpoint)
    const updated = appendStoredFarmer(farmer);
    setRegistrations(updated);
    const dynamicKPIs = computeFarmersKPIs(updated);
    setKpis((prev) => ({
      ...prev,
      ...dynamicKPIs,
    }));
    // Show payment popup with barcode before displaying the token slip
    setPendingPaymentFarmer(farmer);
  };

  // Complete payment and transition to Token Modal
  const handlePaymentProceed = (txnRef: string) => {
    setPaymentTxnRef(txnRef);
    const farmer = pendingPaymentFarmer;
    setPendingPaymentFarmer(null);
    if (farmer) {
      setNewlyRegisteredFarmer(farmer);
    }
  };

  // Cancel payment popup
  const handleCancelPayment = () => {
    setPendingPaymentFarmer(null);
  };

  // Close Token Modal and clear/reset the registration form back to initial stage
  const handleCloseTokenModal = () => {
    setNewlyRegisteredFarmer(null);
    setPaymentTxnRef('');
    setFormResetKey((prev) => prev + 1);
  };

  // Handle Admin approving a registration
  const handleApprove = (id: string) => {
    const updated = updateFarmerInStorage(id, { status: 'Approved' });
    setRegistrations(updated);
    const dynamicKPIs = computeFarmersKPIs(updated);
    setKpis((prev) => ({
      ...prev,
      ...dynamicKPIs,
    }));
  };

  // Handle Admin flagging/rejecting a registration
  const handleReject = (id: string) => {
    const updated = updateFarmerInStorage(id, { status: 'Flagged' });
    setRegistrations(updated);
    const dynamicKPIs = computeFarmersKPIs(updated);
    setKpis((prev) => ({
      ...prev,
      ...dynamicKPIs,
    }));
  };

  // Select farmer from Status table to dispense bags
  const handleSelectForIssuance = (farmer: FarmerRegistration) => {
    setFarmerForIssuance(farmer);
    setActiveTab('issuance-counter');
  };

  // Complete bag issuance at POS counter
  const handleCompleteIssuance = (farmer: FarmerRegistration, txn: DBTTransaction) => {
    const recordId = farmer.id || farmer.tokenNumber;
    const updated = updateFarmerInStorage(recordId, { status: 'Issued' });
    setRegistrations(updated);
    const dynamicKPIs = computeFarmersKPIs(updated);

    setTransactions((prev) => [txn, ...prev]);

    setKpis((prev) => ({
      ...prev,
      ...dynamicKPIs,
      ureaIssuedBags: prev.ureaIssuedBags + farmer.quantityBags,
      consumedQuotaBags: prev.consumedQuotaBags + farmer.quantityBags,
    }));

    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku === 'IFFCO-UREA-45KG') {
          return {
            ...item,
            stockInHand: Math.max(0, item.stockInHand - farmer.quantityBags),
            allocatedToday: item.allocatedToday + farmer.quantityBags,
          };
        }
        if (item.sku === 'IFFCO-NANO-500ML') {
          const nanoCount = farmer.nanoUreaBottles || 0;
          return {
            ...item,
            stockInHand: Math.max(0, item.stockInHand - nanoCount),
            allocatedToday: item.allocatedToday + nanoCount,
          };
        }
        return item;
      })
    );
  };

  // Login handler: every login hits https://ydnyan0804.app.n8n.cloud/webhook-test/farmer once
  const handleLoginSuccess = (name: string, role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setOfficerName(name);
    localStorage.setItem('kendra_auth', 'true');
    localStorage.setItem('kendra_role', role);
    localStorage.setItem('kendra_officer', name);

    // Operator can ONLY do Kisan registration
    // Admin does approval / management
    if (role === 'operator') {
      setActiveTab('farmer-registration');
    } else {
      setActiveTab('status-approvals');
    }

    // Every login hit once to fetch latest updated records from webhook, clear old cache, and map only with API response
    fetchFarmersFromWebhook().then((res) => {
      if (res.success) {
        setRegistrations(res.records);
        const dynamicKPIs = computeFarmersKPIs(res.records);
        setKpis((prev) => ({
          ...prev,
          ...dynamicKPIs,
        }));
      }
    });
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kendra_auth');
    localStorage.removeItem('kendra_role');
    localStorage.removeItem('kendra_officer');
  };

  // Toggle English / Hindi
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // 1. Login Page: Admin and Operator login without any wipe cache button
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        currentMac={currentMac}
        operators={operators}
      />
    );
  }

  // Operator is strictly locked to Kisan Registration only
  // Admin cannot do Kisan Registration
  const effectiveTab: ActiveTab =
    userRole === 'operator'
      ? 'farmer-registration'
      : activeTab === 'farmer-registration'
        ? 'status-approvals'
        : activeTab;

  const featuredFarmer = registrations[0] || null;

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col justify-between font-sans antialiased text-stone-900">
      {/* Top Fixed Portal Header */}
      <Header
        kpis={kpis}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLogout={handleLogout}
        officerName={officerName}
        userRole={userRole}
        onOpenWipeModal={userRole === 'admin' ? () => setIsWipeModalOpen(true) : undefined}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto">
        {/* Left Sidebar partitioned by role */}
        <Sidebar
          activeTab={effectiveTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={kpis.pendingApprovals}
          userRole={userRole}
          onLogout={handleLogout}
          onOpenWipeModal={userRole === 'admin' ? () => setIsWipeModalOpen(true) : undefined}
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 p-4 sm:p-5 overflow-x-hidden min-w-0">
          {/* Operator Only: Kisan Pre-Registration */}
          {userRole === 'operator' && (
            <FarmerRegistrationView
              key={formResetKey}
              onRegisterSuccess={handleRegisterSuccess}
              language={language}
            />
          )}

          {/* Admin Only: Status & Approvals */}
          {userRole === 'admin' && effectiveTab === 'status-approvals' && (
            <StatusApprovalsView
              registrations={registrations}
              onApprove={handleApprove}
              onReject={handleReject}
              onSelectForIssuance={handleSelectForIssuance}
            />
          )}

          {/* Admin Only: Issuance Counter */}
          {userRole === 'admin' && effectiveTab === 'issuance-counter' && (
            <IssuanceCounterView
              initialFarmer={farmerForIssuance}
              onCompleteIssuance={handleCompleteIssuance}
              availableRegistrations={registrations}
            />
          )}

          {/* Admin Only: Inventory & Depot */}
          {userRole === 'admin' && effectiveTab === 'inventory-depot' && (
            <InventoryDepotView inventory={inventory} />
          )}

          {/* Admin Only: Reports & DBT Logs */}
          {userRole === 'admin' && effectiveTab === 'reports-logs' && (
            <ReportsLogsView transactions={transactions} />
          )}

          {/* Admin Only: Operator Management with Hardware MAC Address */}
          {userRole === 'admin' && effectiveTab === 'operator-management' && (
            <OperatorManagementView
              currentMac={currentMac}
              operators={operators}
              onAddOperator={handleAddOperator}
              onToggleStatus={handleToggleOperatorStatus}
              onDeleteOperator={handleDeleteOperator}
              onUpdateOperatorMac={handleUpdateOperatorMac}
            />
          )}
        </main>

        {/* Right Sidebar */}
        <div className="hidden xl:block p-4 sm:p-5 pl-0">
          <RightSidebar
            currentFarmerPhoto={featuredFarmer?.photoUrl}
            currentFarmerName={featuredFarmer?.nameAsPerAadhaar}
          />
        </div>
      </div>

      {/* Payment Modal popup before landing to Token slip */}
      {pendingPaymentFarmer && (
        <PaymentModal
          farmer={pendingPaymentFarmer}
          amount={100}
          onProceed={handlePaymentProceed}
          onCancel={handleCancelPayment}
        />
      )}

      {/* Token Modal when farmer completes registration */}
      {newlyRegisteredFarmer && (
        <TokenModal
          farmer={newlyRegisteredFarmer}
          paidAmount={100}
          txnReference={paymentTxnRef}
          onClose={handleCloseTokenModal}
        />
      )}

      {/* Admin Exclusive: Wipe Cache Modal */}
      {userRole === 'admin' && (
        <WipeCacheModal
          isOpen={isWipeModalOpen}
          onClose={() => setIsWipeModalOpen(false)}
          onConfirmWipe={handleAdminConfirmWipe}
          officerName={officerName}
        />
      )}

      {/* Footer bar */}
      <Footer />
    </div>
  );
}
