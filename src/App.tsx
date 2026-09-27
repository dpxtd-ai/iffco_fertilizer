/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { FarmerRegistrationView } from './components/FarmerRegistrationView';
import { StatusApprovalsView } from './components/StatusApprovalsView';
import { IssuanceCounterView } from './components/IssuanceCounterView';
import { InventoryDepotView } from './components/InventoryDepotView';
import { ReportsLogsView } from './components/ReportsLogsView';
import { OperatorManagementView } from './components/OperatorManagementView';
import { TokenModal } from './components/TokenModal';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';

import {
  INITIAL_KPIS,
  INITIAL_REGISTRATIONS,
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
  clearAllApplicationCache,
} from './utils/deviceSecurity';

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
  // Admin only does approval, so default for admin is 'status-approvals'
  // Operator does Kisan registration, so default for operator is 'farmer-registration'
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const savedRole = localStorage.getItem('kendra_role');
    return savedRole === 'operator' ? 'farmer-registration' : 'status-approvals';
  });

  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Clean application state (no dummy records)
  const [kpis, setKpis] = useState<KendraKPIs>(INITIAL_KPIS);
  const [registrations, setRegistrations] = useState<FarmerRegistration[]>(INITIAL_REGISTRATIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<DBTTransaction[]>(INITIAL_DBT_LOGS);

  // Active modal for newly generated token slip
  const [newlyRegisteredFarmer, setNewlyRegisteredFarmer] = useState<FarmerRegistration | null>(null);

  // Direct hand-off from Registration or Status view to Issuance Counter
  const [farmerForIssuance, setFarmerForIssuance] = useState<FarmerRegistration | null>(null);

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

  // Clear all application cache & reset state
  const handleClearAllCache = () => {
    clearAllApplicationCache();
    setIsAuthenticated(false);
    setUserRole('admin');
    setRegistrations([]);
    setTransactions([]);
    setKpis({
      preRegistrationsToday: 0,
      ureaIssuedBags: 0,
      pendingApprovals: 0,
      bufferStockBags: 12400,
      targetQuotaBags: 4000,
      consumedQuotaBags: 0,
    });
    setNewlyRegisteredFarmer(null);
    setFarmerForIssuance(null);
  };

  // Handle successful Kisan registration by Operator
  const handleRegisterSuccess = (farmer: FarmerRegistration) => {
    setRegistrations((prev) => [farmer, ...prev]);
    setKpis((prev) => ({
      ...prev,
      preRegistrationsToday: prev.preRegistrationsToday + 1,
      pendingApprovals: prev.pendingApprovals + 1,
    }));
    setNewlyRegisteredFarmer(farmer);
  };

  // Handle Admin approving a registration
  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    setKpis((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
    }));
  };

  // Handle Admin flagging/rejecting a registration
  const handleReject = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Flagged' } : r))
    );
    setKpis((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
    }));
  };

  // Transition from token slip modal to issuance counter
  const handleProceedToIssue = (farmer: FarmerRegistration) => {
    setNewlyRegisteredFarmer(null);
    setFarmerForIssuance(farmer);
    setActiveTab('issuance-counter');
  };

  // Select farmer from Status table to dispense bags
  const handleSelectForIssuance = (farmer: FarmerRegistration) => {
    setFarmerForIssuance(farmer);
    setActiveTab('issuance-counter');
  };

  // Complete bag issuance at POS counter
  const handleCompleteIssuance = (farmer: FarmerRegistration, txn: DBTTransaction) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === farmer.id ? { ...r, status: 'Issued' } : r))
    );

    setTransactions((prev) => [txn, ...prev]);

    setKpis((prev) => ({
      ...prev,
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
          return {
            ...item,
            stockInHand: Math.max(0, item.stockInHand - farmer.nanoUreaBottles),
            allocatedToday: item.allocatedToday + farmer.nanoUreaBottles,
          };
        }
        return item;
      })
    );
  };

  // Login handler
  const handleLoginSuccess = (name: string, role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setOfficerName(name);
    localStorage.setItem('kendra_auth', 'true');
    localStorage.setItem('kendra_role', role);
    localStorage.setItem('kendra_officer', name);

    // If Admin: only does approvals, cannot do Kisan registration! Default to 'status-approvals'
    // If Operator: does Kisan registration, default to 'farmer-registration'
    if (role === 'admin') {
      setActiveTab('status-approvals');
    } else {
      setActiveTab('farmer-registration');
    }
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

  // 1. Direct Login Page: Always accessible. Admin can log in from any system without MAC check.
  // Operator validates MAC address along with credentials on login.
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        currentMac={currentMac}
        operators={operators}
        onClearCache={handleClearAllCache}
      />
    );
  }

  // Ensure Admin cannot access Kisan registration tab
  const effectiveTab: ActiveTab =
    userRole === 'admin' && activeTab === 'farmer-registration'
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
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 p-4 sm:p-5 overflow-x-hidden min-w-0">
          {/* Operator Only: Kisan Pre-Registration */}
          {userRole === 'operator' && effectiveTab === 'farmer-registration' && (
            <FarmerRegistrationView
              onRegisterSuccess={handleRegisterSuccess}
              language={language}
            />
          )}

          {/* Status & Approvals: Admin does approvals only, Operator can view status */}
          {effectiveTab === 'status-approvals' && (
            <StatusApprovalsView
              registrations={registrations}
              onApprove={handleApprove}
              onReject={handleReject}
              onSelectForIssuance={handleSelectForIssuance}
            />
          )}

          {/* Issuance Counter */}
          {effectiveTab === 'issuance-counter' && (
            <IssuanceCounterView
              initialFarmer={farmerForIssuance}
              onCompleteIssuance={handleCompleteIssuance}
              availableRegistrations={registrations}
            />
          )}

          {/* Inventory & Depot */}
          {effectiveTab === 'inventory-depot' && (
            <InventoryDepotView inventory={inventory} />
          )}

          {/* Reports & DBT Logs */}
          {effectiveTab === 'reports-logs' && (
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

      {/* Token Modal when farmer completes registration */}
      {newlyRegisteredFarmer && (
        <TokenModal
          farmer={newlyRegisteredFarmer}
          onClose={() => setNewlyRegisteredFarmer(null)}
          onProceedToIssue={handleProceedToIssue}
        />
      )}

      {/* Footer bar */}
      <Footer />
    </div>
  );
}
