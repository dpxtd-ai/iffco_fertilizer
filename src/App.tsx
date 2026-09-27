/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { FarmerRegistrationView } from './components/FarmerRegistrationView';
import { StatusApprovalsView } from './components/StatusApprovalsView';
import { IssuanceCounterView } from './components/IssuanceCounterView';
import { InventoryDepotView } from './components/InventoryDepotView';
import { ReportsLogsView } from './components/ReportsLogsView';
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
} from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if session stored in localStorage
    return localStorage.getItem('kendra_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('farmer-registration');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const [kpis, setKpis] = useState<KendraKPIs>(INITIAL_KPIS);
  const [registrations, setRegistrations] = useState<FarmerRegistration[]>(INITIAL_REGISTRATIONS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<DBTTransaction[]>(INITIAL_DBT_LOGS);

  // Active modal for newly generated token slip
  const [newlyRegisteredFarmer, setNewlyRegisteredFarmer] = useState<FarmerRegistration | null>(null);

  // Direct hand-off from Registration or Status view to Issuance Counter
  const [farmerForIssuance, setFarmerForIssuance] = useState<FarmerRegistration | null>(null);

  // Handle successful registration
  const handleRegisterSuccess = (farmer: FarmerRegistration) => {
    setRegistrations((prev) => [farmer, ...prev]);
    setKpis((prev) => ({
      ...prev,
      preRegistrationsToday: prev.preRegistrationsToday + 1,
    }));
    setNewlyRegisteredFarmer(farmer);
  };

  // Handle approving a registration
  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved', biometricVerified: true } : r))
    );
    setKpis((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
    }));
  };

  // Handle flagging/rejecting a registration
  const handleReject = (id: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Flagged' } : r))
    );
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
    // 1. Mark registration as Issued
    setRegistrations((prev) =>
      prev.map((r) => (r.id === farmer.id ? { ...r, status: 'Issued' } : r))
    );

    // 2. Add transaction to DBT Logs
    setTransactions((prev) => [txn, ...prev]);

    // 3. Update live stock and KPIs
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
  const handleLoginSuccess = (_officerName: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('kendra_auth', 'true');
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kendra_auth');
  };

  // Toggle English / Hindi
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  // If user is not authenticated, show official login screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Find currently featured farmer for photo / preview
  const featuredFarmer = registrations[0] || INITIAL_REGISTRATIONS[0];

  return (
    <div className="min-h-screen bg-[#f4f7f4] flex flex-col justify-between font-sans antialiased text-stone-900">
      {/* Top Fixed Portal Header */}
      <Header
        kpis={kpis}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLogout={handleLogout}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={kpis.pendingApprovals}
          onLogout={handleLogout}
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 p-4 sm:p-5 overflow-x-hidden min-w-0">
          {activeTab === 'farmer-registration' && (
            <FarmerRegistrationView
              onRegisterSuccess={handleRegisterSuccess}
              language={language}
            />
          )}

          {activeTab === 'status-approvals' && (
            <StatusApprovalsView
              registrations={registrations}
              onApprove={handleApprove}
              onReject={handleReject}
              onSelectForIssuance={handleSelectForIssuance}
            />
          )}

          {activeTab === 'issuance-counter' && (
            <IssuanceCounterView
              initialFarmer={farmerForIssuance}
              onCompleteIssuance={handleCompleteIssuance}
              availableRegistrations={registrations}
            />
          )}

          {activeTab === 'inventory-depot' && (
            <InventoryDepotView inventory={inventory} />
          )}

          {activeTab === 'reports-logs' && (
            <ReportsLogsView transactions={transactions} />
          )}
        </main>

        {/* Right Sidebar - exactly matching image for Farmer Pre-Registration */}
        <div className="hidden xl:block p-4 sm:p-5 pl-0">
          <RightSidebar
            currentFarmerPhoto={featuredFarmer.photoUrl}
            currentFarmerName={featuredFarmer.nameAsPerAadhaar}
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
