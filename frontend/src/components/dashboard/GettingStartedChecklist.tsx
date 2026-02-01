import { CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GettingStartedChecklist = () => {
    const steps = [
        { label: "Complete Profile", done: true, path: "/app/profile" },
        { label: "Link Social Accounts", done: false, path: "/app/settings" },
        { label: "Upload First Track", done: false, path: "/app/upload" },
    ];

    return (
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <h3 className="text-sm font-semibold mb-3">Getting Started</h3>
            <div className="space-y-3">
                {steps.map((step, index) => (
                    <Link key={index} to={step.path} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            {step.done ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                            <span className={`text-sm ${step.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                {step.label}
                            </span>
                        </div>
                        {!step.done && (
                            <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Start
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};
