import React from 'react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-warm-white pt-16">
      <div className="bg-primary text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-200 hover:text-white font-sourcesans text-sm mb-4 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Back
          </button>
          <h1 className="font-merriweather font-black text-3xl">Terms of Service</h1>
          <p className="font-sourcesans text-blue-200 text-sm mt-2">Last updated: March 2025 | Dr. Sarah Khan, Islamabad Heart Institute</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="font-sourcesans text-amber-800 text-sm">
            <strong>Important Medical Disclaimer:</strong> This website is for appointment booking purposes only and does not constitute medical advice. In case of a cardiac emergency, call <strong>1122</strong> immediately. Do not rely on this website for urgent medical guidance.
          </p>
        </div>

        <div className="space-y-8">

          <Section title="1. Acceptance of Terms">
            <p>By accessing and using this website and appointment booking system, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this service. These terms apply to all visitors, patients, and users of the Dr. Sarah Khan patient portal.</p>
          </Section>

          <Section title="2. Nature of This Service">
            <p>This website provides:</p>
            <ul>
              <li>Information about Dr. Sarah Khan's qualifications and services</li>
              <li>An online appointment booking and management system</li>
              <li>General health education information</li>
              <li>Contact details for the clinic</li>
            </ul>
            <p>This website does <strong>not</strong> provide:</p>
            <ul>
              <li>Medical diagnosis or treatment advice</li>
              <li>Emergency medical services</li>
              <li>Prescription of medications</li>
              <li>Second opinions on medical reports</li>
            </ul>
          </Section>

          <Section title="3. Appointment Booking">
            <SubSection title="3.1 Booking Confirmation">
              <p>An appointment booking through this system creates a provisional appointment request. Appointment confirmation is sent via SMS. If you do not receive a confirmation, please contact the clinic directly at +92-319-0539976.</p>
            </SubSection>
            <SubSection title="3.2 Cancellation Policy">
              <p>Appointments must be cancelled at least 24 hours in advance. Failure to attend without prior notice may result in a no-show fee being charged for future bookings. Emergency cancellations will be considered on a case-by-case basis.</p>
            </SubSection>
            <SubSection title="3.3 Consultation Fees">
              <p>Consultation fees are as displayed on the booking form. Fees are payable at the time of the appointment. The clinic accepts cash, debit/credit cards, and major insurance panels. Fees are subject to change; the current fee will always be confirmed at the time of booking.</p>
            </SubSection>
            <SubSection title="3.4 Lateness Policy">
              <p>Patients arriving more than 15 minutes late may need to be rescheduled to avoid disrupting subsequent appointments. Please contact us if you are running late.</p>
            </SubSection>
          </Section>

          <Section title="4. Patient Responsibilities">
            <ul>
              <li>Provide accurate and complete personal and medical information</li>
              <li>Attend scheduled appointments or cancel in advance</li>
              <li>Follow the treatment plan and advice provided by Dr. Khan</li>
              <li>Disclose all medications, supplements, and alternative treatments</li>
              <li>Inform the clinic of any changes in your health condition between appointments</li>
              <li>Treat clinic staff with courtesy and respect</li>
            </ul>
          </Section>

          <Section title="5. Teleconsultation Terms">
            <p>Teleconsultation services are subject to the following conditions:</p>
            <ul>
              <li>A stable internet connection and a device with a camera and microphone are required</li>
              <li>Teleconsultation is not appropriate for emergencies or physical examinations requiring in-person assessment</li>
              <li>Consultations are conducted over a secure, encrypted video platform</li>
              <li>Recording of teleconsultations without explicit consent is strictly prohibited</li>
              <li>Prescriptions issued via teleconsultation are at Dr. Khan's clinical discretion</li>
            </ul>
          </Section>

          <Section title="6. Medical Disclaimer">
            <p>Information provided on this website is for general educational purposes only and should not be interpreted as medical advice. Always consult Dr. Khan or another qualified healthcare professional for specific medical concerns. Do not delay seeking emergency care based on information found on this website.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on this website — including text, medical information, design elements, and branding — is the intellectual property of Dr. Sarah Khan and the Islamabad Heart Institute. Reproduction, distribution, or modification of any content without explicit written permission is prohibited.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, Dr. Sarah Khan and the Islamabad Heart Institute shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or appointment booking system. Our liability for direct damages shall not exceed the amount paid for the specific consultation giving rise to the claim.</p>
          </Section>

          <Section title="9. Governing Law">
            <p>These Terms of Service are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Islamabad.</p>
          </Section>

          <Section title="10. Contact">
            <div className="bg-secondary rounded-xl p-4 mt-2">
              <div className="font-dmsans font-bold text-primary text-sm">Dr. Sarah Khan — FCPS Cardiology</div>
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
    <div className="font-sourcesans text-text-secondary text-sm leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul>li]:mb-1">{children}</div>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="ml-4">
    <h3 className="font-dmsans font-bold text-text-primary text-sm mb-1.5">{title}</h3>
    {children}
  </div>
);

export default TermsOfService;
