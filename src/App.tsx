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
import { DeviceWhitelistView } from './components/DeviceWhitelistView';
import { DeviceBlockedScreen } from './components/DeviceBlockedScreen';
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
  WhitelistedDevice,
} from './types';
import {
  getOrCreateSystemMacAddress,
  getInitialWhitelistedDevices,
  saveWhitelistedDevices,
  isMacAddressWhitelisted,
  clearAllApplicationCache,
} from './utils/deviceSecurity';

export default function App() {
  // Device Hardware Security: System MAC Address
  const [currentMac, setCurrentMac] = useState<string>(() => getOrCreateSystemMacAddress());
  const [whitelistedDevices, setWhitelistedDevices] = useState<WhitelistedDevice[]>(() =>
    getInitialWhitelistedDevices()
  );
  const [isSimulatingUnauthorized, setIsSimulatingUnauthorized] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kendra_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('farmer-registration');
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

  // Check if current system MAC address is whitelisted by Admin
  const isDeviceAuthorized =
    !isSimulatingUnauthorized && isMacAddressWhitelisted(currentMac, whitelistedDevices);

  // Authorize / Whitelist device from blocked screen
  const handleAuthorizeFromBlockedScreen = (deviceName: string) => {
    const newDevice: WhitelistedDevice = {
      id: `DEV-${Date.now().toString().slice(-4)}`,
      deviceName: deviceName || 'Authorized Admin Terminal',
      macAddress: currentMac,
      ipAddress: '10.24.112.45',
      authorizedBy: 'Master Administrator Override',
      addedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastSeen: 'Just now',
      deviceType: 'Admin Terminal',
      notes: 'Whitelisted via Administrator Master Override',
    };

    const updated = [newDevice, ...whitelistedDevices];
    setWhitelistedDevices(updated);
    saveWhitelistedDevices(updated);
    setIsSimulatingUnauthorized(false);
  };

  // Reset MAC address to original primary
  const handleResetToDefaultMac = () => {
    setIsSimulatingUnauthorized(false);
    const primary = whitelistedDevices.find((d) => d.status === 'Active');
    if (primary) {
      setCurrentMac(primary.macAddress);
    }
  };

  // Add a new device to whitelist (Admin action)
  const handleAddDevice = (deviceData: Omit<WhitelistedDevice, 'id' | 'addedAt'>) => {
    const newDevice: WhitelistedDevice = {
      ...deviceData,
      id: `DEV-${Date.now().toString().slice(-4)}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newDevice, ...whitelistedDevices];
    setWhitelistedDevices(updated);
    saveWhitelistedDevices(updated);
  };

  // Toggle device active/blocked status
  const handleToggleDeviceStatus = (id: string) => {
    const updated = whitelistedDevices.map((d) =>
      d.id === id ? { ...d, status: (d.status === 'Active' ? 'Blocked' : 'Active') as 'Active' | 'Blocked' } : d
    );
    setWhitelistedDevices(updated);
    saveWhitelistedDevices(updated);
  };

  // Remove device from whitelist
  const handleRemoveDevice = (id: string) => {
    const updated = whitelistedDevices.filter((d) => d.id !== id);
    setWhitelistedDevices(updated);
    saveWhitelistedDevices(updated);
  };

  // Toggle simulate unauthorized MAC
  const handleToggleSimulateUnauthorized = () => {
    setIsSimulatingUnauthorized((prev) => !prev);
  };

  // Clear all application cache & reset state
  const handleClearAllCache = () => {
    clearAllApplicationCache();
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

  // 1. HARDWARE ENFORCEMENT: If device MAC is not whitelisted, block access completely!
  if (!isDeviceAuthorized) {
    return (
      <DeviceBlockedScreen
        detectedMac={isSimulatingUnauthorized ? '74:D4:35:EE:99:FF' : currentMac}
        onAuthorizeDevice={handleAuthorizeFromBlockedScreen}
        onResetToDefaultMac={handleResetToDefaultMac}
      />
    );
  }

  // 2. USER AUTHENTICATION: If user is not logged in, show official login screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        currentMac={currentMac}
        onClearCache={handleClearAllCache}
      />
    );
  }

  const featuredFarmer = registrations[0] || null;

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

          {activeTab === 'device-whitelist' && (
            <DeviceWhitelistView
              currentMac={currentMac}
              devices={whitelistedDevices}
              onAddDevice={handleAddDevice}
              onToggleStatus={handleToggleDeviceStatus}
              onRemoveDevice={handleRemoveDevice}
              onClearCache={handleClearAllCache}
              onSimulateUnauthorizedMac={handleToggleSimulateUnauthorized}
              isSimulatingUnauthorized={isSimulatingUnauthorized}
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
