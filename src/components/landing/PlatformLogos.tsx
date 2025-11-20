import { Music2, Play, Video, Music } from "lucide-react";

export const PlatformLogos = () => {
  const platforms = [
    { name: "Deezer", icon: Music2 },
    { name: "Spotify", icon: Music },
    { name: "YouTube", icon: Play },
    { name: "TikTok", icon: Video },
    { name: "Audiomack", icon: Music2 },
    { name: "Tidal", icon: Music },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-primary via-accent to-primary/80 py-6 mt-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-around gap-8 overflow-x-auto">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <div key={index} className="flex items-center gap-2 text-white min-w-fit">
                <Icon className="h-6 w-6" />
                <span className="font-semibold text-sm">{platform.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
