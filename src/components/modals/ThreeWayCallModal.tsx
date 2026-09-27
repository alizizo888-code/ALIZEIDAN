import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, PhoneOff, Volume2, Users, Shield, Radio } from 'lucide-react';

interface ThreeWayCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreeWayCallModal: React.FC<ThreeWayCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#213145] text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 border border-white/10 animate-fade-in text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400">
              مكالمة ثلاثية سيادية مباشرة (Three-Way Relay)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white/80 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Call Timer */}
        <div>
          <span className="text-4xl font-black font-mono tracking-widest block text-emerald-400">
            {formatTime(seconds)}
          </span>
          <span className="text-xs text-white/70 mt-1 block">
            جسر الاتصال مشفر بنظام AES-256 E2EE تحت إشراف م. علي طلعت زيدان
          </span>
        </div>

        {/* 3 Participants Avatars in Conference */}
        <div className="grid grid-cols-3 gap-3 py-4">
          {/* Owner */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-emerald-500/40 relative">
            <span className="absolute -top-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              المالك السيادي
            </span>
            <div className="w-14 h-14 rounded-full bg-[#006948] flex items-center justify-center font-bold text-lg text-white ring-4 ring-emerald-400/30">
              علي
            </div>
            <span className="text-xs font-bold truncate w-full">م. علي زيدان</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-300">
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>يتحدث الآن</span>
            </div>
          </div>

          {/* Customer */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
              سعد
            </div>
            <span className="text-xs font-bold truncate w-full">سعد القحطاني</span>
            <span className="text-[10px] text-white/60">العميل المستفيد</span>
          </div>

          {/* Technician */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center font-bold text-lg text-white">
              فهد
            </div>
            <span className="text-xs font-bold truncate w-full">فهد الشمري</span>
            <span className="text-[10px] text-white/60">فني الميدان</span>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-2xl text-xs text-white/80 leading-relaxed text-right border border-white/10">
          <p className="font-bold text-emerald-400 mb-1">توجيه المهندس علي:</p>
          <p>
            "يا أستاذ سعد، فحص الفريون مشمول بالكامل بضمان مؤسسة أكسجين، وفهد يقوم بتركيب القطعة
            الأصلية المعتمدة من سابر فوراً دون أي تكلفة إضافية."
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors ${
              isMuted ? 'bg-red-500' : 'bg-white/15 hover:bg-white/25'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={onClose}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white cursor-pointer shadow-lg transition-transform hover:scale-105"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
