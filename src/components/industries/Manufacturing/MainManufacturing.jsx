import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import IndustryStats from './IndustryStats';
import ChallengesSection from './ChallengesSection';
import SolutionsSection from './SolutionsSection';
import CaseStudies from './CaseStudies';
import ImplementationProcess from './ImplementationProcess';
import CTASection from './CTASection';
import Modal from '../../Modal';
import ContactForm from '../../ContactForm';

const Manufacturing = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(0);
  const [activeSolution, setActiveSolution] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/manufacturing-data.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate challenges and solutions
  useEffect(() => {
    if (!data) return;
    
    const challengeInterval = setInterval(() => {
      setActiveChallenge((prev) => (prev + 1) % data.manufacturingChallenges.length);
    }, 4000);
    
    const solutionInterval = setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % data.netSuiteSolutions.length);
    }, 5000);

    return () => {
      clearInterval(challengeInterval);
      clearInterval(solutionInterval);
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading manufacturing data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load manufacturing data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section data-theme="dark">
        <HeroSection data={data.hero} />
      </section>

      <section data-theme="light">
        <IndustryStats data={data.industryStats} />
      </section>

      <section data-theme="dark">
        <ChallengesSection 
          data={data.manufacturingChallenges} 
          activeChallenge={activeChallenge}
          setActiveChallenge={setActiveChallenge}
        />
      </section>

      <section data-theme="light">
        <SolutionsSection 
          data={data.netSuiteSolutions} 
          activeSolution={activeSolution}
          setActiveSolution={setActiveSolution}
        />
      </section>

      <section data-theme="dark">
        <CaseStudies data={data.caseStudies} />
      </section>

      <section data-theme="light">
        <ImplementationProcess data={data.implementationProcess} />
      </section>

      <section data-theme="light">
        <CTASection 
          data={data.cta} 
          openContactModal={openContactModal}
        />
      </section>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        title={data.modal.title}
        subtitle={data.modal.subtitle}
      >
        <div className="p-2">
          <ContactForm />
        </div>
      </Modal>
    </div>
  );
};

export default Manufacturing;