import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function VideoInterface({ patientName }: { patientName: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(c => c + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const endCall = () => {
    alert('Consultation ended. Prescription and notes have been saved.');
    navigate('/doctor');
  };

  return (
    <div className="flex flex-col h-full bg-black relative rounded-xl overflow-hidden group">
      
      {/* Remote Video (Patient) */}
      <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
        {/* Placeholder image for patient video feed */}
        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 flex items-center justify-center relative shadow-2xl">
           <img 
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${patientName}&backgroundColor=334155&textColor=cbd5e1`} 
            alt={patientName} 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        <p className="mt-4 text-white font-medium text-lg drop-shadow-md">{patientName}</p>
        <p className="text-white/60 text-sm mt-1">{formatTime(callDuration)}</p>
      </div>

      {/* Local Video (Doctor PIP) */}
      <div className="absolute bottom-24 right-4 w-40 h-56 bg-slate-800 rounded-lg border-2 border-white/20 shadow-2xl overflow-hidden flex items-center justify-center z-10 transition-transform group-hover:scale-105">
        {isVideoOff ? (
          <div className="flex flex-col items-center text-white/50">
             <VideoOff size={24} className="mb-2" />
             <span className="text-xs font-semibold">Camera Off</span>
          </div>
        ) : (
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=doctor&backgroundColor=0f172a`} 
            alt="Doctor video" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Top Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center gap-2">
           <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
           <span className="text-white text-xs font-bold uppercase tracking-wider shadow-black drop-shadow-md">Live Consultation</span>
        </div>
        <button className="text-white hover:bg-white/20 p-2 rounded-lg backdrop-blur-sm transition-colors">
          <Maximize size={18} />
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex justify-center items-center gap-4 z-10">
        <ControlButton 
          active={!isMuted} 
          icon={isMuted ? <MicOff size={20} /> : <Mic size={20} />} 
          onClick={() => setIsMuted(!isMuted)} 
          danger={isMuted}
        />
        <ControlButton 
          active={!isVideoOff} 
          icon={isVideoOff ? <VideoOff size={20} /> : <Video size={20} />} 
          onClick={() => setIsVideoOff(!isVideoOff)} 
          danger={isVideoOff}
        />
        <ControlButton 
          active={false} 
          icon={<MessageSquare size={20} />} 
          onClick={() => {}} 
        />
        
        <button 
          onClick={endCall}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center ml-2 border-2 border-red-400/20"
        >
          <PhoneOff size={24} />
        </button>
      </div>

    </div>
  );
}

function ControlButton({ active, icon, onClick, danger }: { active: boolean, icon: React.ReactNode, onClick: () => void, danger?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3.5 rounded-full backdrop-blur-md transition-all border outline-none 
        ${danger ? 'bg-red-500/90 hover:bg-red-600 border-red-500/50 text-white shadow-lg shadow-red-500/20' : 
        active ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' : 
        'bg-white text-black hover:bg-gray-200 border-white'}
      `}
    >
      {icon}
    </button>
  );
}
