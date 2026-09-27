import React from 'react';
import { 
  Users, 
  CheckSquare, 
  Building2, 
  Package, 
  FileText, 
  Headphones, 
  LogOut 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingApprovalsCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
  onLogout,
}) => {
  const menuItems: { id: ActiveTab; label: string; labelHindi: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'farmer-registration',
      label: 'Farmer Pre-Registration',
      labelHindi: 'कृषक पूर्व-पंजीकरण',
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'status-approvals',
      label: 'Status & Approvals',
      labelHindi: 'स्थिति एवं अनुमोदन',
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
      badge: pendingApprovalsCount,
    },
    {
      id: 'issuance-counter',
      label: 'Issuance Counter',
      labelHindi: 'उर्वरक वितरण काउंटर',
      icon: <Building2 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'inventory-depot',
      label: 'Inventory & Depot',
      labelHindi: 'भंडार एवं डिपो स्टॉक',
      icon: <Package className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reports-logs',
      label: 'Reports & DBT Logs',
      labelHindi: 'रिपोर्ट्स व डीबीटी लॉग',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside className="w-64 bg-[#fafcfa] border-r border-stone-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-108px)] p-3 select-none">
      <div>
        <div className="px-3 pt-2 pb-3">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            PORTAL OPERATIONS
          </p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-md text-left text-[13px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1b4e23] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100/90 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-amber-400 text-stone-900'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom info & Logout */}
      <div className="space-y-3 pt-4 border-t border-stone-200">
        {/* District Help Badge */}
        <div className="bg-[#eff7f0] border border-emerald-200/80 rounded-md p-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <Headphones className="w-3.5 h-3.5" />
          </div>
          <div className="text-[11px]">
            <p className="font-bold text-emerald-950">IFFCO District Help</p>
            <p className="text-stone-600 font-medium">ext. 8831 / support@iffco.in</p>
          </div>
        </div>

        {/* Exit / Sign out button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Exit / Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
