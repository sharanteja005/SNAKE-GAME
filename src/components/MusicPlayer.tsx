import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulse (AI Gen)",
    artist: "Synthbot v1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-fuchsia-400",
    shadow: "shadow-fuchsia-500/50"
  },
  {
    id: 2,
    title: "Cybernetic Echoes (AI Gen)",
    artist: "Algorhythm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-cyan-400",
    shadow: "shadow-cyan-500/50"
  },
  {
    id: 3,
    title: "Digital Horizon (AI Gen)",
    artist: "Neural Net",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    color: "text-lime-400",
    shadow: "shadow-lime-500/50"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };
  
  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <footer className="h-24 bg-[#08090d] border-t border-white/10 px-6 sm:px-10 flex items-center justify-between z-20 shrink-0 w-full text-white">
      <audio 
        ref={audioRef} 
        src={track.url} 
        onEnded={skipForward} 
        autoPlay
      />
      
      {/* Left: Track Info */}
      <div className="w-8 sm:w-64 flex items-center gap-3 truncate">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 rounded-lg hidden sm:flex items-center justify-center shrink-0 border border-white/5 relative overflow-hidden">
           {/* Visualizer bars */}
           <div className="flex items-end gap-0.5 h-4 absolute bottom-2">
             <div className={`w-1 bg-cyan-400 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`}></div>
             <div className={`w-1 bg-cyan-400 ${isPlaying ? 'h-4 animate-pulse' : 'h-1'}`} style={{ animationDelay: '0.1s' }}></div>
             <div className={`w-1 bg-cyan-400 ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '0.2s' }}></div>
           </div>
        </div>
        <div className="truncate hidden sm:block">
          <div className="text-sm font-medium text-gray-200 truncate">{track.title}</div>
          <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase truncate">{track.artist}</div>
        </div>
        <div className="sm:hidden block">
          <Music className={`w-6 h-6 ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`} />
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-6 sm:gap-10">
        <button 
          onClick={skipBack}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          {isPlaying ? <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />}
        </button>
        
        <button 
          onClick={skipForward}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Right: Volume */}
      <div className="w-8 sm:w-64 flex items-center justify-end gap-4">
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full sm:max-w-[200px]">
          <button onClick={toggleMute} className="text-gray-500 hover:text-white cursor-pointer transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="flex-1 w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 hidden sm:block"
          />
        </div>
      </div>
    </footer>
  );
}
