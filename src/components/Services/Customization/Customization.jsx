import React, { useState, useEffect } from "react";
import HeroContent from "./HeroSection";
import ServicesContent from "./ServicesSection";
import ProcessContent from "./ProcessSection";
import CtaContent from "./CtaSection";

const Customization = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./data/customization.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>No data available</div>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-blue-50 to-white min-h-screen text-slate-800">
      {/* Hero Section - Dark Theme */}
      <section 
        className="w-full min-h-screen bg-gradient-to-br from-[#191970] via-black to-blue-700 py-24 md:py-32 text-center flex flex-col items-center justify-center relative overflow-hidden"
        data-theme="dark"
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <HeroContent title={pageData.hero.title} subtitle={pageData.hero.subtitle} />
      </section>

      {/* Services Section - Light Theme */}
      <section className="py-20 bg-white" data-theme="light">
        <ServicesContent title={pageData.services.title} items={pageData.services.items} />
      </section>

      {/* Process Section - Light Theme */}
      <section className="py-20 bg-gray-50" data-theme="light">
        <ProcessContent title={pageData.process.title} steps={pageData.process.steps} />
      </section>

      {/* CTA Section - Dark Theme */}
      <section className="py-16 bg-blue-800 text-white text-center" data-theme="dark">
        <CtaContent 
          title={pageData.cta.title} 
          subtitle={pageData.cta.subtitle} 
          buttonText={pageData.cta.buttonText} 
        />
      </section>
    </main>
  );
};

export default Customization;