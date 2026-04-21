/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="h-screen w-full bg-[#050608] text-gray-100 font-sans overflow-hidden flex flex-col relative">
      
      {/* Atmospheric Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      <header className="h-20 flex items-center justify-between px-6 sm:px-10 border-b border-white/5 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">NEON BEAT SNAKE</span>
        </div>
      </header>

      <main className="flex-1 flex px-6 py-6 gap-6 relative z-10 overflow-hidden">
        
        {/* Sidebar: System Info / Instructions */}
        <aside className="w-72 hidden lg:flex flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 items-center gap-2 flex">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM INFO
            </h3>
            <ul className="text-xs text-gray-400 font-mono space-y-3 leading-relaxed">
              <li className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-xl">
                <span>AUDIO</span>
                <span className="text-cyan-400">AI-GEN</span>
              </li>
              <li className="flex justify-between items-center hover:bg-white/5 px-3 py-2 rounded-xl transition-colors">
                <span>RENDER</span>
                <span className="text-gray-200">REACT</span>
              </li>
              <li className="flex justify-between items-center hover:bg-white/5 px-3 py-2 rounded-xl transition-colors">
                <span>INPUT</span>
                <span className="text-gray-200">WASD / ARROWS</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Instructions</h3>
            <div className="space-y-4 text-xs text-gray-400 leading-relaxed">
              <p><span className="text-cyan-400 font-mono text-[10px] bg-white/5 px-1.5 py-0.5 border border-white/10 rounded">[WASD]</span> or Arrow Keys to move.</p>
              <p>Collect <span className="text-purple-400 font-medium">Pellets</span> to grow and increase your score.</p>
              <p>Don't hit the walls or yourself.</p>
            </div>
          </div>
        </aside>

        {/* Center Game Window */}
        <div className="flex-1 flex flex-col min-w-0">
          <SnakeGame />
        </div>
        
      </main>

      {/* Footer Music Player */}
      <MusicPlayer />
      
    </div>
  );
}
