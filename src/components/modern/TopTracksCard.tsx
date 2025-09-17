import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  plays: string;
  change: string;
  changeType: 'positive' | 'negative';
}

interface TopTracksCardProps {
  tracks: Track[];
}

export const TopTracksCard = ({ tracks }: TopTracksCardProps) => {
  return (
    <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
          <Music className="h-5 w-5 text-[#6c5ce7]" />
          Top Tracks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44] hover:bg-[#161629] transition-all duration-200 cursor-pointer">
            <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-[#6c5ce7]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white truncate">{track.name}</p>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{track.plays}</p>
                  <span className={`text-xs font-medium ${
                    track.changeType === 'positive' ? 'text-[#00b894]' : 'text-[#e17055]'
                  }`}>
                    {track.change}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#8b8ba3]">plays this week</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};