export const PlatformLogos = () => {
  const platforms = [
    "Audiomack",
    "Tidal", 
    "Wynk Music",
    "SoundCloud",
    "Pandora",
    "Napster",
    "Spotify",
    "Apple Music",
    "YouTube Music",
    "Deezer",
    "Amazon Music",
    "Boomplay"
  ];

  // Duplicate platforms for seamless infinite scroll
  const duplicatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <div className="w-full relative overflow-hidden py-8 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
      {/* Wavy bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{
        clipPath: 'polygon(0 50%, 10% 30%, 20% 40%, 30% 20%, 40% 35%, 50% 15%, 60% 30%, 70% 20%, 80% 35%, 90% 25%, 100% 40%, 100% 100%, 0 100%)'
      }} />
      
      <div className="relative">
        {/* Gradient overlays for fade effect on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-purple-600 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cyan-400 to-transparent z-10" />
        
        {/* Scrolling container - pauses on hover */}
        <div className="flex gap-12 animate-scroll hover:pause-animation">
          {duplicatedPlatforms.map((platform, index) => (
            <div 
              key={index}
              className="flex-shrink-0 text-white font-bold text-xl tracking-wide whitespace-nowrap transition-transform hover:scale-110"
            >
              {platform}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: flex;
        }
        
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
