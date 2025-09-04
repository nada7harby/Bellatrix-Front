import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const [navbarData, setNavbarData] = useState({
    services: [],
    industries: [],
    solutions: []
  });

  // Fetch navbar data (shared across all pages)
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const response = await fetch('/data/homeData.json');
        if (response.ok) {
          const data = await response.json();
          setNavbarData({
            services: data.services?.services || [],
            industries: data.industries?.industries || [],
            solutions: data.solutions?.solutions || []
          });
        }
      } catch (error) {
        console.error('Error fetching navbar data:', error);
        // Fallback data if fetch fails
        setNavbarData({
          services: [
            { title: "Strategic Consultation", link: "#" },
            { title: "Implementation", link: "/Implementation" },
            { title: "Training", link: "/Training" },
            { title: "Tailored Customization", link: "#" },
            { title: "Seamless Integration", link: "#" }
          ],
          industries: [],
          solutions: []
        });
      }
    };

    fetchNavbarData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <Navbar 
        services={navbarData.services}
        industries={navbarData.industries}
        solutions={navbarData.solutions}
      />
      
      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Fixed Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
