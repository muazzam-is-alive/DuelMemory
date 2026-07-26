import React from 'react';
import { Achievement } from '../types';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-purple-500/30 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Achievements</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {unlockedCount} / {achievements.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Grid of Badges */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-2.5 pr-1">
          {achievements.map((ach) => {
            const IconComp = (Icons as unknown as Record<string, React.ElementType>)[ach.iconName] || Award;

            return (
              <div
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? 'bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border-amber-500/40'
                    : 'bg-slate-950/50 border-slate-800/80 opacity-65'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                    ach.unlocked
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                {/* Badge Title & Description */}
                <div className="flex-1 flex flex-col leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold ${
                        ach.unlocked ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {ach.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">{ach.description}</span>

                  {/* Progress Bar if present */}
                  {ach.maxProgress && !ach.unlocked && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((ach.progress || 0) / ach.maxProgress) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Lock or Check status */}
                {ach.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
