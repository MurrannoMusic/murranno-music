import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const UpcomingReleaseCountdown = () => {
    // Mock date - replace with next release date
    const releaseDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    const trackName = "Summer Vibes";

    const calculateTimeLeft = () => {
        const difference = +releaseDate - +new Date();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
            };
        }
        return null;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute is enough for UI

        return () => clearTimeout(timer);
    });

    if (!timeLeft) return null;

    return (
        <div className="mx-4 my-2 p-4 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Upcoming Release</span>
                </div>
                <p className="font-bold text-lg text-foreground">{trackName}</p>
            </div>

            <div className="flex gap-2 text-center">
                <div className="bg-background/40 rounded-lg p-2 min-w-[50px] backdrop-blur-md">
                    <div className="text-xl font-bold font-mono">{timeLeft.days}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Day</div>
                </div>
                <div className="bg-background/40 rounded-lg p-2 min-w-[50px] backdrop-blur-md">
                    <div className="text-xl font-bold font-mono">{timeLeft.hours}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Hrs</div>
                </div>
            </div>
        </div>
    );
};
