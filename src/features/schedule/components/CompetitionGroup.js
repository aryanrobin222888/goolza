"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import MatchRow from "./MatchRow";
import { getArabicName, mapEventToMatch } from "@/features/schedule/utils/mappers";

// Internal Component for Logo Fallback
const TournamentLogo = ({ id, name, defaultLogo }) => {
  const [imgSrc, setImgSrc] = useState(
    defaultLogo || 
    `https://res.cloudinary.com/dcssegtok/image/upload/koora-press/competitions/${id}.png`
  );
  
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
      // Sequence: 
      // 0. Cloudinary (custom bucket)
      // 1. Sofascore API (direct)
      // 2. Sofascore CDN (static)
      // 3. Give up -> Hide
      
      const strategies = [
          `https://api.sofascore.app/api/v1/unique-tournament/${id}/image`,
          `https://www.sofascore.com/static/images/unique-tournaments/${id}.png`
      ];

      if (attempt < strategies.length) {
          setImgSrc(strategies[attempt]);
          setAttempt(prev => prev + 1);
      } else {
          setImgSrc(null); // Hide on final fail
      }
  };

  if (!imgSrc) return null;

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center p-1 shadow-sm select-none shrink-0">
        <img
        src={imgSrc}
        alt={name}
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      {/* Header - Simple & Clean */}
      <motion.div 
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
      </motion.div>

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
    </motion.div>
  );
}
