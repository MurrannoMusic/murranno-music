import { Trophy } from 'lucide-react';

export const MilestoneTracker = () => {
    // Mock data - replace with real milestone hook later
    const milestone = {
        title: "Rising Artist",
        current: 3,
        target: 5,
        unit: "uploads",
        message: "Upload 2 more tracks to become a 'Rising Artist'"
    };

    const progress = (milestone.current / milestone.target) * 100;

    return (
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Trophy className="h-12 w-12 text-primary" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-primary">Next Milestone</h3>
                    <span className="text-xs font-medium text-muted-foreground">{milestone.current}/{milestone.target} {milestone.unit}</span>
                </div>

                <p className="text-xs text-foreground/80 mb-3">{milestone.message}</p>

                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
