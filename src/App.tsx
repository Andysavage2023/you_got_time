import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Phase = 'banter' | 'countdown' | 'video' | 'message' | 'finale';

const BANTER_QUESTIONS = [
  "Do you got a minute?",
  "Are you sure?",
  "Are you REALLY sure? Pakka na?",
  "For real this time, are you Sure Sure?",
  "Last chance to say no... ready?"
];

/**
 * BACKGROUNDS CONFIGURATION
 * You can change the URLs below to your own hosted images.
 */
const BACKGROUNDS: Record<string, string> = {
  'banter-0': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202026-03-30%20at%2000.12.02.jpeg",
  'banter-1': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202026-03-30%20at%2000.12.02%20(1).jpeg",
  'banter-2': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202026-03-30%20at%2000.12.02%20(2).jpeg",
  'banter-3': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202026-03-30%20at%2000.12.02%20(3).jpeg",
  'banter-4': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202026-03-29%20at%2020.18.28%20(1).jpeg",
  'countdown': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202026-03-29%20at%2023.46.33%20(2).jpeg",
  'message': "https://ik.imagekit.io/7spkzmdko/WhatsApp%20Image%202025-10-20%20at%2008.14.05.jpeg",
  'finale': "https://ik.imagekit.io/7spkzmdko/Valley_front_Page_teal.png",
};

const NoButton = ({ onHover }: { onHover: () => void }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    const newX = (Math.random() - 0.5) * 300;
    const newY = (Math.random() - 0.5) * 300;
    setPosition({ x: newX, y: newY });
    onHover();
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseEnter={handleMouseEnter}
      onClick={() => alert("Nice try! But you have to say Yes! 😉")}
      className="px-8 py-3 bg-white/90 backdrop-blur-sm text-rose-600 border-2 border-rose-200 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
    >
      No
    </motion.button>
  );
};

export default function App() {
  const [phase, setPhase] = useState<Phase>('banter');
  const [banterIndex, setBanterIndex] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [musicStarted, setMusicStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Background music management
  useEffect(() => {
    if (audioRef.current) {
      if (phase === 'video' || !musicStarted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          console.log("Autoplay blocked. User needs to interact first.");
        });
      }
    }
  }, [phase, musicStarted]);

  // Countdown logic
  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('video');
      }
    }
  }, [phase, countdown]);

  // Real Fireworks logic
  useEffect(() => {
    if (phase === 'finale') {
      const duration = 20 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        // Firework burst effect
        const particleCount = 150;
        const colors = ['#ff0000', '#ffd700', '#ffffff', '#00ff00', '#0000ff', '#ff00ff'];
        
        confetti({
          particleCount,
          spread: 360,
          origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.2, 0.5) },
          colors,
          startVelocity: 30,
          gravity: 0.5,
          ticks: 200,
          shapes: ['circle'],
          scalar: 0.7
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleYes = () => {
    if (banterIndex === 0) {
      setMusicStarted(true);
    }
    if (banterIndex < BANTER_QUESTIONS.length - 1) {
      setBanterIndex(banterIndex + 1);
    } else {
      setPhase('countdown');
    }
  };

  const currentBgKey = phase === 'banter' ? `banter-${banterIndex}` : phase;
  const currentBg = BACKGROUNDS[currentBgKey] || BACKGROUNDS['banter-0'];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-rose-200 relative">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="https://ik.imagekit.io/7spkzmdko/tum-se-hi-instrumental.mp3"
        loop
      />

      {/* Dynamic Background Image */}
      <AnimatePresence mode="wait">
        {phase !== 'video' && (
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0"
          >
            <img 
              src={currentBg} 
              alt="Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'banter' && (
          <motion.div
            key={`banter-${banterIndex}`}
            initial={{ rotateY: 90, opacity: 0, x: 100 }}
            animate={{ rotateY: 0, opacity: 1, x: 0 }}
            exit={{ rotateY: -90, opacity: 0, x: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{ perspective: 1000 }}
            className="text-center p-8 max-w-2xl z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-16 leading-tight drop-shadow-lg">
              {BANTER_QUESTIONS[banterIndex]}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-8 relative">
              <button
                onClick={handleYes}
                className="px-12 py-4 bg-rose-500 text-white rounded-full font-bold text-lg shadow-xl hover:bg-rose-600 hover:scale-105 transition-all active:scale-95"
              >
                Yes!
              </button>
              <NoButton onHover={() => {}} />
            </div>
          </motion.div>
        )}

        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="text-center z-10"
          >
            <motion.h2
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="text-9xl font-black text-white mb-4 drop-shadow-2xl"
            >
              {countdown > 0 ? countdown : "GO!"}
            </motion.h2>
            <p className="text-2xl font-medium text-rose-200 uppercase tracking-widest drop-shadow-md">
              Get ready!
            </p>
          </motion.div>
        )}

        {phase === 'video' && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full fixed inset-0 bg-black z-50"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setPhase('message')}
            >
              <source src="https://ik.imagekit.io/7spkzmdko/Untitled%20(1).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button 
              onClick={() => setPhase('message')}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/30 backdrop-blur-md text-white/60 hover:text-white text-xs rounded-full border border-white/10 transition-all z-50"
            >
              Skip to message
            </button>
          </motion.div>
        )}

        {phase === 'message' && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center p-12 max-w-3xl z-10 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
          >
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-relaxed drop-shadow-md">
                अर्ज़ किया है!
              </h2>
              <p className="text-xl md:text-2xl text-rose-100 leading-loose">
                वो सर्द रात, वो सरहदें, और सर पे कहकशाँ का साया,<br />
                किसी की प्यारी सी आवाज़ में हमने जैसे सारा दर्द भुलाया।<br />
                जो जगहें कभी न देखी थीं, न जाने हम उसे कब अपना बना आए, <br />
                अब तो ये खुदा जाने कि उस रात सितारों ने हमें क्या-क्या नगमे सुनाया।
              </p>
              <button
                onClick={() => setPhase('finale')}
                className="mt-8 px-10 py-3 bg-white text-rose-600 rounded-full font-bold shadow-lg hover:bg-rose-50 transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'finale' && (
          <motion.div
            key="finale"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <motion.h1 
              animate={{ 
                color: ["#FFD700", "#FFA500", "#FFD700"],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-8xl font-black drop-shadow-2xl mb-6"
            >
              HAPPY BIRTHDAY!
            </motion.h1>
            <p className="text-xl text-white font-medium italic drop-shadow-md">
              Wishing you the most wonderfull day ever! ✨
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <button
                onClick={() => {
                  setMusicStarted(false);
                  setPhase('banter');
                  setBanterIndex(0);
                  setCountdown(3);
                }}
                className="px-8 py-3 bg-white text-rose-600 rounded-full font-bold shadow-lg hover:bg-rose-50 transition-all active:scale-95 uppercase tracking-widest text-sm"
              >
                Return
              </button>
              <button
                onClick={() => {
                  setMusicStarted(false);
                  window.close();
                  // Fallback if window.close() is blocked
                  alert("You can now close this tab. Have a great day!");
                }}
                className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold shadow-lg hover:bg-rose-700 transition-all active:scale-95 uppercase tracking-widest text-sm"
              >
                Quit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
