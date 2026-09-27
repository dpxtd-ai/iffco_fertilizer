import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f4f7f4] border-t border-stone-200/90 px-4 sm:px-6 py-3 select-none text-[11px] text-stone-600">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left Badges */}
        <div className="flex items-center gap-3 font-bold tracking-wider text-stone-700 text-[10.5px]">
          <span>DIGITAL INDIA</span>
          <span className="text-stone-300">•</span>
          <span>NATIONAL INFORMATICS CENTRE (NIC)</span>
          <span className="text-stone-300">•</span>
          <span>PMKVY AGRI DBT INITIATIVE</span>
        </div>

        {/* Right Legal */}
        <div className="text-center md:text-right text-[10.5px] text-stone-500 font-medium">
          <p>© 2024 Department of Fertilizers, Ministry of Chemicals & Fertilizers, Govt. of India.</p>
          <p className="text-stone-400">For Official Authorized Agricultural POS and Kendra Deployment Only.</p>
        </div>
      </div>
    </footer>
  );
};
