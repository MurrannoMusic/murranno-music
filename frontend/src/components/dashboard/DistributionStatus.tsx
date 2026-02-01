import { Circle, AlertCircle, CheckCircle2 } from 'lucide-react';

export const DistributionStatus = () => {
    // Mock data - replace with useReleases hook
    const statuses = [
        { title: "Summer Vibes", status: "live", platform: "Spotify, Apple" },
        { title: "Midnight Rain", status: "review", platform: "In Review" },
        { title: "Neon Dreams", status: "error", platform: "Artwork Issue" },
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'live':
                return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'Live' };
            case 'review':
                return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Circle, label: 'In Review' };
            case 'error':
                return { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle, label: 'Action Required' };
            default:
                return { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: Circle, label: 'Pending' };
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground px-1">Distribution Status</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {statuses.map((item, index) => {
                    const config = getStatusConfig(item.status);
                    const Icon = config.icon;

                    return (
                        <div key={index} className={`min-w-[160px] p-3 rounded-xl border border-white/5 bg-card/50 backdrop-blur-sm flex flex-col gap-2`}>
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-full ${config.bg}`}>
                                    <Icon className={`h-3 w-3 ${config.color}`} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{item.platform}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
