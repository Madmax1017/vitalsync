import React from 'react';
import Hero from "./components/Hero";
import Features from "./components/Features";
import About from "./components/About";
import NavigationHub from "./components/NavigationHub";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <Features />
            <About />
            <NavigationHub />
            <Marquee />
            <Footer />
        </>
    );
}
