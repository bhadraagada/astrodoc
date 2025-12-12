import Link from "next/link";
import { Rocket, Satellite, Activity, Heart, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-deep-space/50 text-moon-silver py-16 border-t border-white/10 mt-20 relative overflow-hidden">
      {/* Footer Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-deep-space to-transparent opacity-80 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 group">
              <div className="p-2 rounded-full bg-stellar-cyan/10 border border-stellar-cyan/30 group-hover:bg-stellar-cyan/20 transition-colors">
                <Rocket className="h-5 w-5 text-stellar-cyan" />
              </div>
              <span className="text-xl font-bold font-space text-star-white">AstroDoc</span>
            </div>
            <p className="text-sm font-tech text-gray-400 mb-6 leading-relaxed">
              Mission-critical health monitoring and parallel timeline simulations for space explorers.
              Your personal medical officer in the void.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-stellar-cyan transition-colors transform hover:scale-110 duration-200"
              >
                <Satellite className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-stellar-cyan transition-colors transform hover:scale-110 duration-200"
              >
                <Shield className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-stellar-cyan transition-colors transform hover:scale-110 duration-200"
              >
                <Activity className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold font-space text-star-white uppercase tracking-wider mb-4">Missions</h3>
            <ul className="space-y-3 font-tech">
              <li>
                <Link
                  href="/stories"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Health Logs
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Command Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Mission Directives
                </Link>
              </li>
              <li>
                <Link
                  href="/stories/create"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Log New Entry
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold font-space text-star-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3 font-tech">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Beacon
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Transmission Log
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Medical Database
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Crew Quarters
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold font-space text-star-white uppercase tracking-wider mb-4">Protocols</h3>
            <ul className="space-y-3 font-tech">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Protocol
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Service Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Data Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-stellar-cyan transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-stellar-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Control
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 text-center text-gray-500 font-tech text-xs">
          <p>© {new Date().getFullYear()} AstroDoc Systems. All systems nominal.</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span>Engineered with</span>
            <Heart className="h-3 w-3 text-critical-red animate-pulse" />
            <span>by Bhadra, Aliasgar, Kavya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
