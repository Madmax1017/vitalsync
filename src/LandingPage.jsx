import React from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import NavigationHub from "./components/NavigationHub";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";

export default function LandingPage() {
    return (
        <div className="bg-[#f8f7ff] min-h-screen">
            <Navbar />
            <Hero />
            <div id="features"><Features /></div>
            <div id="about"><About /></div>
            <div id="roles"><NavigationHub /></div>
            <Marquee />
            <Footer />
        </div>
    );
}
