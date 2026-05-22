"use client";
import { getArabicName } from "@/features/schedule/utils/mappers";

function ManagerSide({ manager, label }) {
  if (!manager) return <div className="flex-1" />;

  const imgUrl = `/api/sofascore/manager/${manager.id}/image`;

  return (
    <div className="flex-1 flex items-center gap-3">
      <img
        src={imgUrl}
        alt={manager.name}
        className="w-12 h-12 rounded-full bg-slate-700 object-cover border border-slate-600"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div>
        <p className="text-sm font-semibold text-white">{getArabicName(manager.name, manager.fieldTranslations)}</p>
        <p className="text-xs text-[#ff7a00]">{label}</p>
      </div>
    </div>
  );
}

export default function ManagersCard({ data }) {
  if (!data?.homeManager && !data?.awayManager) return null;

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">المدربون</h3>
      <div className="flex items-start justify-between gap-4">
        <ManagerSide manager={data.homeManager} label="مدرب" />
        <ManagerSide manager={data.awayManager} label="مدرب" />
      </div>
    </div>
  );
}
