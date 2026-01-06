
import { motion } from 'framer-motion';
import { FileSpreadsheet, CheckCircle2, User, AlertCircle } from 'lucide-react';

interface TicketCardProps {
    issue: string;
    priority: string;
    userName: string;
    ticketId: string;
}

export function TicketCard({ issue, priority, userName, ticketId }: TicketCardProps) {
    const getPriorityColor = (p: string) => {
        switch (p.toLowerCase()) {
            case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'login': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-xl overflow-hidden max-w-sm mt-2 mb-4"
        >
            <div className="bg-surfaceHighlight px-4 py-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <FileSpreadsheet size={16} className="text-emerald-500" />
                    <span>Ticket Saved to Sheets</span>
                </div>
                <CheckCircle2 size={16} className="text-emerald-500" />
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold mb-1">Issue</div>
                    <p className="text-sm text-primary font-medium leading-snug">{issue}</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold mb-1">Priority</div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(priority)}`}>
                            {priority}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold mb-1">User</div>
                        <div className="flex items-center gap-1.5 text-sm text-secondary">
                            <User size={12} />
                            <span>{userName}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-secondary">
                    <span>ID: #{ticketId}</span>
                    <span className="flex items-center gap-1">
                        <AlertCircle size={10} />
                        Synced
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
