import React, { useState, useEffect } from "react";
import PayrollHero from "./PayrollHero";
import PayrollPainPoints from "./PayrollPainPoints";
import PayrollHowItWorks from "./PayrollHowItWorks";
import PayrollWorkflow from "./PayrollWorkflow";
import PayrollFAQ from "./PayrollFAQ";
import PayrollCTA from "./PayrollCTA";
import Modal from "../../Modal";
import ContactForm from "../../ContactForm";

export default function PayrollPage({ data }) {
  // If data is passed as a prop (from SolutionMain), use it. Otherwise, fallback to local fetch (for direct use/testing)
  const [pageData, setPageData] = useState(data || null);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (data) return; // If data is provided as prop, skip fetch
    const fetchData = async () => {
      try {
        const response = await fetch("/data/payroll.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        setPageData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [data]);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  const handleRetry = () => window.location.reload();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || "No payroll data found."}</div>
        <button onClick={handleRetry} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section data-theme="dark">
        <PayrollHero 
          title={pageData.hero?.title}
          subtitle={pageData.hero?.subtitle}
          bgColor={pageData.hero?.bgColor}
          bgVideo={pageData.hero?.bgVideo}
          onCtaClick={openContactModal}
        />
      </section>

      {/* Pain Points Section */}
      <section data-theme="light">
        <PayrollPainPoints painPoints={pageData.painPoints || []} />
      </section>

      {/* How It Works Section */}
      <section data-theme="dark">
        <PayrollHowItWorks workflowData={pageData.workflow} />
      </section>

      {/* Workflow Section */}
      <section data-theme="light">
        <PayrollWorkflow workflowData={pageData.workflow} />
      </section>

      {/* FAQ Section */}
      <section data-theme="light">
        <PayrollFAQ faqData={pageData.faq} />
      </section>

      {/* CTA Section */}
      <section data-theme="dark">
        <PayrollCTA 
          ctaData={pageData.cta}
          onCtaClick={openContactModal}
        />
      </section>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        title="Contact Us"
        subtitle="Let's discuss your payroll needs"
      >
        <div className="p-2">
          <ContactForm />
        </div>
      </Modal>
    </div>
  );
}