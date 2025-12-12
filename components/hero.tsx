import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 bg-nebula-blue/20 rounded-full mb-8 animate-fade-in-down border border-stellar-cyan/30 backdrop-blur-md">
          <span className="w-3 h-3 rounded-full bg-stellar-cyan mr-2 animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
          <span className="text-sm font-medium text-stellar-cyan font-tech tracking-wider uppercase">
            System Online: Biometric Tracking Active
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-stellar-cyan via-white to-cosmic-purple bg-clip-text text-transparent animate-fade-in pb-5 font-space leading-tight drop-shadow-sm">
          Mission-Critical Health Monitoring
        </h1>
        <p className="text-xl text-moon-silver mb-10 max-w-2xl mx-auto animate-fade-in-up font-light">
          Advanced parallel timeline simulations to predict health outcomes during long-duration space missions.
          Make informed decisions with AI-powered trajectory analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <Link
            href={"/chat"}
            className="transition-transform hover:scale-105"
          >
            <Button
              className="group bg-gradient-to-r from-stellar-cyan to-nebula-blue hover:from-stellar-cyan/80 hover:to-nebula-blue/80 text-white text-lg px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 border border-stellar-cyan/20"
              size="lg"
            >
              Initialize Scan{" "}
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-2 border-stellar-cyan/30 text-stellar-cyan hover:bg-stellar-cyan/10 hover:text-white hover:border-stellar-cyan/60 text-lg px-8 py-6 rounded-xl transition-all duration-300 backdrop-blur-sm bg-deep-space/50"
            size="lg"
          >
            Mission Protocol
          </Button>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fade-in-up delay-500">
          <div className="flex items-center bg-gradient-to-r from-nebula-blue/10 to-cosmic-purple/10 px-5 py-4 rounded-xl shadow-lg border border-stellar-cyan/10 hover:border-stellar-cyan/30 transition-all duration-300 backdrop-blur-md">
            <div className="bg-nebula-blue/20 rounded-full p-2 mr-3 border border-nebula-blue/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-stellar-cyan"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div className="text-left">
              <span className="font-medium text-stellar-cyan font-space">AI-Powered</span>
              <p className="text-xs text-moon-silver mt-1">
                Deep space predictive algorithms
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gradient-to-r from-cosmic-purple/10 to-nebula-blue/10 px-5 py-4 rounded-xl shadow-lg border border-cosmic-purple/10 hover:border-cosmic-purple/30 transition-all duration-300 backdrop-blur-md">
            <div className="bg-cosmic-purple/20 rounded-full p-2 mr-3 border border-cosmic-purple/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cosmic-purple"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div className="text-left">
              <span className="font-medium text-cosmic-purple font-space">Personalized</span>
              <p className="text-xs text-moon-silver mt-1">
                Astronaut-specific biometrics
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gradient-to-r from-nebula-blue/10 to-stellar-cyan/10 px-5 py-4 rounded-xl shadow-lg border border-nebula-blue/10 hover:border-stellar-cyan/30 transition-all duration-300 backdrop-blur-md">
            <div className="bg-nebula-blue/20 rounded-full p-2 mr-3 border border-nebula-blue/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-stellar-cyan"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="text-left">
              <span className="font-medium text-stellar-cyan font-space">Secure</span>
              <p className="text-xs text-moon-silver mt-1">
                Encrypted health telemetry
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
