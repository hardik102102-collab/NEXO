import { Plus, MessageSquare, Settings, LogOut, Menu } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 flex flex-col`}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-surface font-bold text-lg">N</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-primary">Nexo</h1>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-secondary hover:text-primary">
                        <Menu size={24} />
                    </button>
                </div>

                <div className="px-4 mb-6">
                    <button className="w-full flex items-center gap-2 bg-primary text-background px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                        <Plus size={20} />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-2">
                    <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 px-2">Recent</div>
                    {[1, 2, 3].map((i) => (
                        <button key={i} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-surfaceHighlight hover:text-primary transition-colors group">
                            <MessageSquare size={18} className="group-hover:text-primary" />
                            <span className="truncate">Previous Conversation {i}</span>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-border space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-surfaceHighlight hover:text-primary transition-colors">
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-secondary hover:bg-surfaceHighlight hover:text-primary transition-colors">
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}
