import React from 'react';
import { 
  Users, 
  CheckSquare, 
  Package, 
  FileText, 
  Headphones, 
  LogOut,
  UserCheck,
  Trash2,
  Database,
  ShieldAlert
} from 'lucide-react';
import { ActiveTab, UserRole } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingApprovalsCount: number;
  userRole: UserRole;
  onLogout: () => void;
  onOpenWipeModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
  userRole,
  onLogout,
  onOpenWipeModal,
}) => {
  // Navigation items partitioned by role
  // Admin: does approvals, manages operators + MAC devices, inventory, reports.
  // Operator: can do ONLY Kisan registration as instructed.
  const adminMenuItems: { id: ActiveTab; label: string; labelHindi: string; icon: React.ReactNode; badge?: number; tag?: string }[] = [
    {
      id: 'status-approvals',
      label: 'Status & Approvals',
      labelHindi: 'स्थिति एवं अनुमोदन',
      icon: <CheckSquare className="w-4 h-4 shrink-0" />,
      badge: pendingApprovalsCount, 
    },
    {
      id: 'operator-management',
      label: 'Operator & MAC Devices',
      labelHindi: 'ऑपरेटर व डिवाइस प्रबंधन',
      icon: <UserCheck className="w-4 h-4 shrink-0" />, 
    }, 
    {
      id: 'reports-logs',
      label: 'Reports & DBT Logs',
      labelHindi: 'रिपोर्ट्स व डीबीटी लॉग',
      icon: <FileText className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'inventory-depot',
      label: 'Inventory & Depot',
      labelHindi: 'भंडार एवं डिपो स्टॉक',
      icon: <Package className="w-4 h-4 shrink-0" />,
    },
  ];

  // Operator can ONLY do Kisan Registration
  const operatorMenuItems: { id: ActiveTab; label: string; labelHindi: string; icon: React.ReactNode; badge?: number; tag?: string }[] = [
    {
      id: 'farmer-registration',
      label: 'Kisan Pre-Registration',
      labelHindi: 'कृषक पूर्व-पंजीकरण',
      icon: <Users className="w-4 h-4 shrink-0" />,
      tag: 'Operator Desk',
    },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : operatorMenuItems;

  return (
    <aside className="w-64 bg-[#fafcfa] border-r border-stone-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-108px)] p-3 select-none">
      <div>
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              {userRole === 'admin' ? 'ADMIN CONSOLE' : 'OPERATOR STATION'}
            </p> 
          </div>
        </div>

        <nav className="space-y-1 mt-2">
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

                <div className="flex items-center gap-1.5">
                  {item.tag && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-200 border border-emerald-600'
                          : 'bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}

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
                </div>
              </button>
            );
          })}
        </nav>

        {/* Admin Only: Wipe Cache and System Temp Data Control */}
        {userRole === 'admin' && onOpenWipeModal && (
          <div className="mt-5 pt-4 border-t border-stone-200"> 
              <button
                type="button"
                onClick={onOpenWipeModal}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe Cache Data</span>
              </button> 
          </div>
        )}

        {/* Operator Note: Operator Can Do Only Kisan Registration */}
        {userRole === 'operator' && (
          <div className="mt-4 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-lg text-xs space-y-1">
            <p className="font-bold text-emerald-950 text-[11px]">Operator Desk Policy</p>
            <p className="text-[10.5px] text-stone-600 leading-snug">
              This terminal is assigned strictly for <strong>Kisan Pre-Registration</strong>. Quota verification and approvals are conducted by the Nodal Admin.
            </p>
          </div>
        )}
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
