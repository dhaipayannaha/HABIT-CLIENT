import Container from "./Container";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-white/5 bg-black/20 backdrop-blur-xl relative overflow-hidden">
            <Container>
                <div className="py-12 flex flex-col md:flex-row justify-between items-center gap-10">
                    {/* Brand & Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="relative bg-primary/20 p-1.5 rounded-xl border border-primary/20">
                                <div className="w-5 h-5 bg-primary rounded-lg shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Habit<span className="text-primary not-italic">Tracker</span></h2>
                        </div>
                        <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                            &copy; 2026 Premium. All rights reserved.
                        </p>
                    </div>

                    {/* Compact Links */}
                    <nav>
                        <ul className="flex flex-wrap justify-center gap-8">
                            <li><Link to="/" className="text-[10px] font-black text-muted-foreground/40 hover:text-white transition-all uppercase tracking-[0.2em]">Home</Link></li>
                            <li><Link to="/history" className="text-[10px] font-black text-muted-foreground/40 hover:text-white transition-all uppercase tracking-[0.2em]">History</Link></li>
                            <li><Link to="/add-habit" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-[0.2em]">Create Habit</Link></li>
                        </ul>
                    </nav>

                    {/* Social/Terms (Small) */}
                    <div className="flex gap-6">
                        <a href="#" className="text-[10px] font-black text-muted-foreground/20 hover:text-white uppercase tracking-widest transition-colors">Privacy</a>
                        <a href="#" className="text-[10px] font-black text-muted-foreground/20 hover:text-white uppercase tracking-widest transition-colors">Support</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;