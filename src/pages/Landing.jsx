import React, { useEffect, useRef } from "react";
import Wrapper from "../assets/css/wrappers/LandingPage";
import Navbar from "../components/shared/Navbar";
import Brands from "../components/Home Page/Brands";
import CookieConsentBanner from "./CookieConsentBanner";
import Categories from "../components/Home Page/Categories";
import FeaturedCompanies from "../components/Home Page/FeaturedCompanies";
import TopSection from "../components/Home Page/TopSection";
import Introducing from "../components/Home Page/Introducing";
import BottomNav from "../components/shared/BottomNav";
import { useUserContext } from "../context/UserContext";
import Footer from "./Footer";

const Landing = () => {
    const navbarRef = useRef(null);
    const heroRef = useRef(null);
    const { user } = useUserContext();
    useEffect(() => {
        const navbarHeight = navbarRef.current.getBoundingClientRect().height;
    }, []);
    return (
        <>
            <div>
            <Navbar navbarRef={navbarRef} />
            
            <Wrapper ref={heroRef}>
                {/* ✅ Show BottomNav only for role 3 (regular user) */}
                {user?.ac_status && user?.role === 3 && <BottomNav />}
            </Wrapper>
                <TopSection/>
                <Introducing/>
                <Categories />
                <FeaturedCompanies />
                <Brands />
            </div>
            <Footer />
            
            <CookieConsentBanner />
        </>
    );
};

export default Landing;