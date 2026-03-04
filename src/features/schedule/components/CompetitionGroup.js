"use client";
import { m } from "framer-motion";
import { useState } from "react";
import MatchRow from "./MatchRow";
import { getArabicName, mapEventToMatch } from "@/features/schedule/utils/mappers";

// Inject Cloudinary transformation params to serve a small WebP
function cloudinaryOptimized(url, size = 32) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${size},h_${size},c_fit,f_auto,q_auto/`);
}

// Internal Component for Logo Fallback
const TournamentLogo = ({ id, name, defaultLogo }) => {
  const [imgSrc, setImgSrc] = useState(
    cloudinaryOptimized(defaultLogo) ||
    cloudinaryOptimized(`https://res.cloudinary.com/dcssegtok/image/upload/koora-press/competitions/${id}.png`)
  );
  
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
      const strategies = [
          `https://api.sofascore.app/api/v1/unique-tournament/${id}/image`,
          `https://www.sofascore.com/static/images/unique-tournaments/${id}.png`
      ];

      if (attempt < strategies.length) {
          setImgSrc(strategies[attempt]);
          setAttempt(prev => prev + 1);
      } else {
          setImgSrc(null);
      }
  };

  if (!imgSrc) return null;

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center p-1 shadow-sm select-none shrink-0">
        <img
        src={imgSrc}
        alt={name}
        width={32}
        height={32}
        className="w-full h-full object-contain"
        onError={handleError}
        />
    </div>
  );
};

export default function CompetitionGroup({ competition, index, selectedDate }) {
  const compName = getArabicName(
    competition.info.name,
    competition.info.fieldTranslations
  );
  const categoryName = getArabicName(
    competition.info.category?.name,
    competition.info.uniqueTournament?.category?.fieldTranslations ||
      competition.info.category?.fieldTranslations
  );

  const tournamentLogo =
    competition.info.uniqueTournament?.logo ||
    (competition.info.uniqueTournament?.id
      ? `https://res.cloudinary.com/dcssegtok/image/upload/koora-press/competitions/${competition.info.uniqueTournament.id}.png`
      : null);

  // Stagger container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: index * 0.1 // Stagger groups as well
      }
    }
  };

  return (
    <m.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      {/* Header - Simple & Clean */}
      <m.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="flex items-center gap-3 mb-5 pl-1"
      >
          {competition.info.uniqueTournament?.id && (
             <TournamentLogo 
                id={competition.info.uniqueTournament.id} 
                name={compName} 
                defaultLogo={competition.info.uniqueTournament?.logo}
             />
          )}
          <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {compName.split(/, Group|، المجموعة|، مجموعة/)[0]}
              </h2>
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">{categoryName}</p>
          </div>
      </m.div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-0">
        {competition.matches.map((event, idx) => {
          const isAlreadyMatch = event.home && event.home.name;
          const matchData = isAlreadyMatch
            ? event
            : mapEventToMatch(
                event,
                compName,
                competition.info.uniqueTournament?.id
              );

          return (
            <MatchRow
              key={idx}
              match={matchData}
              index={idx}
              tournamentLogo={tournamentLogo}
              selectedDate={selectedDate}
            />
          );
        })}
      </div>
    </m.div>
  );
}
