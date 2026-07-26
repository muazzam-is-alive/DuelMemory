import React, { useState } from 'react';
import {
  Globe,
  Plus,
  LogIn,
  Users,
  X,
  Copy,
  Check,
  Sparkles,
  Wifi,
  ShieldCheck,
} from 'lucide-react';
import { ColorScheme } from '../types';

interface OnlineMultiplayerModalProps {
  colorScheme?: ColorScheme;
  onClose: () => void;
}

export const OnlineMultiplayerModal: React.FC<OnlineMultiplayerModalProps> = ({
  colorScheme = 'AMOLED_DARK',
  onClose,
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'CREATE' | 'JOIN' | 'FRIENDS'>('CREATE');
  const [generatedCode, setGeneratedCode] = useState('MD-8942');
  const [copied, setCopied] = useState(false);

  const isPink = colorScheme === 'NEON_PINK';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const friendsList = [
    { name: 'Elena_V', status: 'Online', rank: 'Pro Duelist', avatar: '🌸' },
    { name: 'CyberSam', status: 'In Game', rank: 'Grandmaster', avatar: '⚡' },
    { name: 'AuraBot', status: 'Online', rank: 'Practice AI', avatar: '🤖' },
    { name: 'Nova_9', status: 'Offline', rank: 'Master', avatar: '🪐' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col relative border overflow-hidden ${
          isPink
            ? 'bg-slate-950/95 border-pink-500/40 shadow-[0_0_40px_rgba(244,114,182,0.25)]'
            : 'bg-[#0A0A0B]/95 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Glow ambient accent */}
        <div
          className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isPink ? 'bg-pink-600/30' : 'bg-cyan-500/20'
          }`}
        />
        <div
          className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isPink ? 'bg-purple-600/30' : 'bg-purple-600/20'
          }`}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${
                isPink
                  ? 'bg-pink-500/20 border-pink-400/40 text-pink-300'
                  : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
              }`}
            >
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  Online Multiplayer
                </h3>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest border ${
                    isPink
                      ? 'bg-pink-500/20 text-pink-300 border-pink-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  COMING SOON
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Global Matchmaking & Private Rooms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 my-4 relative z-10">
          {[
            { id: 'CREATE', label: 'Create Room', icon: Plus },
            { id: 'JOIN', label: 'Join Room', icon: LogIn },
            { id: 'FRIENDS', label: 'Friends', icon: Users },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-1 rounded-2xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  isActive
                    ? isPink
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 border-pink-400/60 text-white shadow-lg shadow-pink-500/30'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/60 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="space-y-4 my-2 relative z-10">
          {activeTab === 'CREATE' && (
            <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4 flex flex-col items-center text-center space-y-3">
              <p className="text-xs text-slate-300 font-medium">Your Generated Room Code</p>
              <div
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border font-mono text-xl font-bold tracking-widest ${
                  isPink
                    ? 'bg-pink-950/40 border-pink-500/40 text-pink-300'
                    : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                }`}
              >
                <span>{generatedCode}</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-1"
                  title="Copy Room Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Peer-to-Peer Relay Ready • Max 4 Players</span>
              </div>

              <button
                disabled
                className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 opacity-80 cursor-not-allowed ${
                  isPink
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border border-pink-400/40 shadow-lg shadow-pink-500/20'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/40 shadow-lg shadow-cyan-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Host Game Lobby (Preview Only)</span>
              </button>
            </div>
          )}

          {activeTab === 'JOIN' && (
            <div className="bg-slate-900/80 rounded-2xl border border-white/10 p-4 flex flex-col space-y-3">
              <label className="text-xs text-slate-300 font-medium">Enter 6-Digit Room Code</label>
              <input
                type="text"
                maxLength={7}
                placeholder="e.g. MD-8942"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                className={`w-full bg-slate-950 border rounded-2xl p-3 text-center text-lg font-mono font-bold tracking-widest text-white focus:outline-none ${
                  isPink
                    ? 'border-pink-500/40 focus:border-pink-400'
                    : 'border-cyan-500/40 focus:border-cyan-400'
                }`}
              />
              <button
                disabled={!roomCodeInput}
                className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  roomCodeInput
                    ? isPink
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                      : 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Join Lobby</span>
              </button>
            </div>
          )}

          {activeTab === 'FRIENDS' && (
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {friendsList.map((friend) => (
                <div
                  key={friend.name}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{friend.avatar}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{friend.name}</span>
                      <span className="text-[10px] text-slate-400">{friend.rank}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      friend.status === 'Online'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : friend.status === 'In Game'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {friend.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notice Footer */}
        <div className="mt-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-[10px] text-amber-300/90 relative z-10">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Real-time multiplayer server integration is currently in preview mode. Check back soon for cross-device battles!
          </span>
        </div>
      </div>
    </div>
  );
};
