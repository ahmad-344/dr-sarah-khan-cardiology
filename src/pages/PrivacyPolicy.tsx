import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-warm-white pt-16">
      <div className="bg-primary text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-200 hover:text-white font-sourcesans text-sm mb-4 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Back
          </button>
          <h1 className="font-merriweather font-black text-3xl">Privacy Policy</h1>
          <p className="font-sourcesans text-blue-200 text-sm mt-2">Last updated: March 2025 | Dr. Sarah Khan, Islamabad Heart Institute</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose-clinic space-y-8">

          <Section title="1. Introduction">
            <p>This Privacy Policy explains how Dr. Sarah Khan and the Islamabad Heart Institute ("we", "our", "the clinic") collect, use, store, and protect personal information provided through this website and appointment booking system. We are committed to protecting the privacy and confidentiality of all patient information in accordance with the Pakistan Electronic Crimes Act 2016 and applicable healthcare regulations.</p>
            <p>By using this website and booking system, you consent to the collection and use of information as described in this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <SubSection title="2.1 Information You Provide">
              <ul>
                <li>Full name, age, and gender</li>
                <li>Contact details: phone number and email address</li>
                <li>Reason for consultation and medical history (as disclosed during booking)</li>
                <li>Patient type (new or returning)</li>
                <li>Insurance information</li>
              </ul>
            </SubSection>
            <SubSection title="2.2 Automatically Collected Information">
              <ul>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on the website</li>
                <li>Appointment preferences and booking history (stored locally on your device)</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>Your personal information is used exclusively for:</p>
            <ul>
              <li>Scheduling and confirming appointments</li>
              <li>Sending appointment reminders via SMS or email</li>
              <li>Providing and improving medical care</li>
              <li>Processing insurance claims where applicable</li>
              <li>Complying with legal and regulatory requirements</li>
              <li>Internal audit and quality improvement</li>
            </ul>
            <p className="font-semibold">We do not sell, rent, or share your personal information with any third party for marketing or commercial purposes.</p>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>Appointment data entered through this website is stored locally on your device using browser localStorage. No medical records are transmitted to external servers through this booking interface.</p>
            <p>We implement appropriate technical and organisational security measures to protect your information against unauthorised access, alteration, disclosure, or destruction. Clinic-side patient records are maintained in compliance with PMDC and hospital data security standards.</p>
          </Section>

          <Section title="5. Medical Confidentiality">
            <p>All information shared during consultations is protected by strict medical confidentiality. Patient information will not be disclosed without your explicit consent, except where required by law (e.g., mandatory reporting of certain communicable diseases, court order) or where necessary to protect your life or the life of another.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your appointment records from local storage (by clearing your browser data)</li>
              <li>Withdraw consent to receive promotional communications at any time</li>
            </ul>
          </Section>

          <Section title="7. Cookies">
            <p>This website does not use tracking cookies. Browser localStorage is used solely to retain your appointment history for your convenience on the same device. This data is never transmitted externally.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>This website may be used to book appointments for minors with the consent and oversight of a parent or legal guardian. The parent or guardian is responsible for providing accurate information and consenting to this Privacy Policy on the child's behalf.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. Significant changes will be notified on this page with an updated revision date. Your continued use of the website after any changes constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="10. Contact">
            <p>For any questions, concerns, or requests regarding your privacy and personal data, please contact:</p>
            <div className="bg-secondary rounded-xl p-4 mt-2">
              <div className="font-dmsans font-bold text-primary text-sm">Dr. Sarah Khan — Privacy Officer</div>
              <div className="font-sourcesans text-text-secondary text-sm mt-1">Islamabad Heart Institute, G-8/4, Islamabad</div>
              <div className="font-sourcesans text-text-secondary text-sm">Phone: +92-319-0539976</div>
              <div className="font-sourcesans text-text-secondary text-sm">Email: contactahmad.services@gmail.com</div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h2 className="font-merriweather font-bold text-text-primary text-lg mb-3 pb-2 border-b border-border-light">{title}</h2>
    <div className="font-sourcesans text-text-secondary text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="ml-4">
    <h3 className="font-dmsans font-bold text-text-primary text-sm mb-2">{title}</h3>
    <div className="space-y-1 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-1">{children}</div>
  </div>
);

export default PrivacyPolicy;
