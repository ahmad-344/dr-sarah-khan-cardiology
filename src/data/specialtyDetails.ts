export interface SpecialtyDetail {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  heroColor: string;
  overview: string;
  conditions: { name: string; description: string }[];
  procedures: { name: string; description: string; duration?: string }[];
  whatToExpect: string[];
  faqs: { q: string; a: string }[];
  preparation: string[];
  stats: { label: string; value: string }[];
}

export const SPECIALTY_DETAILS: SpecialtyDetail[] = [
  {
    id: 'interventional-cardiology',
    title: 'Interventional Cardiology',
    tagline: 'Minimally invasive catheter-based procedures to treat blocked arteries and structural heart disease.',
    icon: 'heart-pulse',
    heroColor: '#0f4c81',
    overview: `Interventional Cardiology is a subspecialty that uses catheter-based techniques to diagnose and treat coronary artery disease and structural heart conditions — without the need for open-heart surgery. Dr. Sarah Khan is one of Pakistan's leading interventional cardiologists, having performed over 3,000 successful procedures at Islamabad Heart Institute and trained at Mayo Clinic, USA.

Using thin, flexible tubes called catheters inserted through small incisions in the wrist or groin, Dr. Khan can open blocked coronary arteries, place stents to hold them open, and perform a range of life-saving procedures with minimal recovery time. Most patients are discharged within 24–48 hours.`,
    conditions: [
      { name: 'Coronary Artery Disease (CAD)', description: 'Blockages in the arteries supplying blood to the heart muscle, causing chest pain (angina) or heart attack.' },
      { name: 'Acute Myocardial Infarction (Heart Attack)', description: 'Emergency primary PCI to immediately restore blood flow to the blocked coronary artery.' },
      { name: 'Stable Angina', description: 'Recurrent chest pain on exertion due to narrowed coronary arteries — treated with elective stenting.' },
      { name: 'Peripheral Artery Disease', description: 'Blockages in arteries supplying the legs, causing pain and limiting mobility.' },
      { name: 'Structural Heart Disease', description: 'Conditions including valvular heart disease and patent foramen ovale (PFO) treated via catheter.' },
    ],
    procedures: [
      { name: 'Coronary Angiography (CAG)', description: 'A diagnostic procedure using contrast dye and X-ray imaging to visualise the coronary arteries and identify blockages. It is the gold standard for evaluating coronary artery disease.', duration: '30–45 minutes' },
      { name: 'Percutaneous Coronary Intervention (PCI / Stenting)', description: 'A minimally invasive procedure to open blocked coronary arteries using a balloon and placing a metal stent to keep the artery open permanently.', duration: '1–2 hours' },
      { name: 'Primary PCI for Heart Attack', description: 'Emergency angioplasty performed within 90 minutes of a heart attack to restore blood flow and minimise damage to the heart muscle.', duration: '45–90 minutes' },
      { name: 'Fractional Flow Reserve (FFR)', description: 'A pressure measurement taken during angiography to determine whether a borderline blockage requires stenting.', duration: '15–20 min additional' },
      { name: 'Intravascular Ultrasound (IVUS)', description: 'Ultrasound imaging inside the coronary artery to assess plaque composition and guide optimal stent placement.' },
    ],
    whatToExpect: [
      'You will be asked to fast for 4–6 hours before the procedure.',
      'The procedure is performed under local anaesthesia with mild sedation — you remain awake.',
      'A small sheath is inserted in the wrist (radial) or groin (femoral) artery.',
      'Contrast dye is injected and X-ray images are taken to visualise the arteries.',
      'If a blockage is found, a balloon catheter and stent are used to open it.',
      'You will be monitored in recovery for 4–6 hours after the procedure.',
      'Most patients are discharged the next day with a personalised medication plan.',
    ],
    faqs: [
      { q: 'Is coronary angiography painful?', a: 'The procedure is performed under local anaesthesia. You may feel mild pressure at the insertion site, but it is generally well tolerated. Most patients report minimal discomfort.' },
      { q: 'How long do stents last?', a: 'Modern drug-eluting stents are designed to last a lifetime. However, it is essential to take prescribed antiplatelet medications (aspirin + clopidogrel) as directed to prevent stent thrombosis.' },
      { q: 'When can I return to normal activities?', a: 'Most patients return to light activities within 48–72 hours. Strenuous exercise should be avoided for 1–2 weeks. Dr. Khan will provide personalised guidance.' },
      { q: 'What are the risks?', a: 'Serious complications are rare (less than 1%). Minor risks include bruising at the insertion site, allergic reaction to contrast dye, and mild arrhythmias. Dr. Khan will discuss all risks in detail before your procedure.' },
    ],
    preparation: [
      'Fast for 4–6 hours before the procedure (water is permitted)',
      'Continue regular medications unless Dr. Khan advises otherwise',
      'Inform the team of any allergy to contrast dye or iodine',
      'Bring a family member or driver — you should not drive after the procedure',
      'Bring all previous cardiac reports, ECGs, and medication list',
    ],
    stats: [
      { label: 'Procedures Performed', value: '3,000+' },
      { label: 'Success Rate', value: '99.2%' },
      { label: 'Years Experience', value: '18' },
      { label: 'Avg Hospital Stay', value: '24 hrs' },
    ],
  },
  {
    id: 'heart-failure-management',
    title: 'Heart Failure Management',
    tagline: 'Comprehensive, multidisciplinary care for acute and chronic heart failure — improving quality and length of life.',
    icon: 'heart',
    heroColor: '#c0392b',
    overview: `Heart failure does not mean the heart has stopped — it means the heart is not pumping efficiently enough to meet the body's demands. It is a complex, progressive condition affecting over 2 million Pakistanis. With the right management, most patients can live active, fulfilling lives.

Dr. Sarah Khan leads a dedicated Heart Failure Programme at Islamabad Heart Institute, using the latest evidence-based therapies including advanced medications (GDMT), cardiac resynchronisation therapy (CRT), and implantable cardioverter defibrillators (ICD). Her approach is holistic — addressing the medical, nutritional, and psychosocial needs of every patient.`,
    conditions: [
      { name: 'Systolic Heart Failure (HFrEF)', description: 'Reduced ejection fraction — the heart muscle is weakened and cannot contract forcefully enough.' },
      { name: 'Diastolic Heart Failure (HFpEF)', description: 'Preserved ejection fraction — the heart is stiff and cannot relax properly to fill with blood.' },
      { name: 'Acute Decompensated Heart Failure', description: 'Sudden worsening of symptoms requiring urgent hospital treatment and stabilisation.' },
      { name: 'Ischaemic Cardiomyopathy', description: 'Heart failure caused by previous heart attacks and coronary artery disease.' },
      { name: 'Dilated Cardiomyopathy', description: 'An enlarged, weakened heart often linked to viral infection, genetics, or alcohol.' },
    ],
    procedures: [
      { name: 'Comprehensive Heart Failure Assessment', description: 'Including echocardiography, BNP blood test, 6-minute walk test, and cardiopulmonary exercise testing to accurately stage heart failure severity.', duration: '60–90 minutes' },
      { name: 'Guideline-Directed Medical Therapy (GDMT)', description: 'Optimisation of the four pillars of heart failure therapy: ACE inhibitors/ARNi, beta-blockers, mineralocorticoid antagonists, and SGLT2 inhibitors.' },
      { name: 'Cardiac Resynchronisation Therapy (CRT)', description: 'A specialised pacemaker that coordinates the contraction of the left and right ventricles, significantly improving symptoms and prognosis in selected patients.' },
      { name: 'Remote Monitoring Programme', description: 'Patients receive daily weight monitoring guidance and access to a dedicated heart failure nurse specialist for early detection of decompensation.' },
      { name: 'Nutritional and Lifestyle Counselling', description: 'Personalised fluid and sodium restriction plans, exercise prescription, and smoking cessation support.' },
    ],
    whatToExpect: [
      'Initial consultation includes a full history, physical examination, and review of all investigations.',
      'Echocardiography is usually performed to assess heart function.',
      'Blood tests including BNP, renal function, and electrolytes are standard.',
      'A personalised treatment plan is provided with written patient education materials.',
      'Regular follow-up appointments (every 1–3 months initially) to monitor and optimise treatment.',
      'Access to a dedicated heart failure nurse specialist between appointments.',
    ],
    faqs: [
      { q: 'Can heart failure be cured?', a: 'In some cases (such as alcohol-related cardiomyopathy), significant recovery is possible. In most cases, heart failure can be effectively managed, allowing patients to live normal, active lives for many years.' },
      { q: 'Why do I need to weigh myself daily?', a: 'A sudden weight gain of more than 2 kg in 24 hours often indicates fluid retention — an early warning sign of decompensation. Early detection allows us to adjust your medications before hospitalisation is needed.' },
      { q: 'Can I exercise with heart failure?', a: 'Yes — supervised exercise is now recommended for stable heart failure patients and significantly improves quality of life. Dr. Khan will prescribe an individualised exercise plan appropriate for your stage of heart failure.' },
    ],
    preparation: [
      'Bring a diary of your daily weights for the past 2 weeks if possible',
      'Bring a complete list of all current medications and dosages',
      'Bring all previous echocardiograms and cardiac investigations',
      'Note your main symptoms: breathlessness, swelling, fatigue',
      'Consider bringing a family member to help understand the management plan',
    ],
    stats: [
      { label: 'Patients Under Care', value: '800+' },
      { label: 'Readmission Reduction', value: '40%' },
      { label: 'Clinic Follow-up Rate', value: '94%' },
      { label: 'Patient Satisfaction', value: '4.9/5' },
    ],
  },
  {
    id: 'preventive-cardiology',
    title: 'Preventive Cardiology',
    tagline: 'Identifying and addressing your heart risk before a cardiac event occurs — because prevention is always better than cure.',
    icon: 'shield-check',
    heroColor: '#27ae60',
    overview: `Preventive Cardiology is the proactive management of cardiovascular risk factors to prevent heart attacks, strokes, and other cardiac events. Pakistan has one of the highest rates of premature heart disease in the world — largely driven by modifiable risk factors including hypertension, diabetes, obesity, smoking, and physical inactivity.

Dr. Sarah Khan's Preventive Cardiology clinic uses validated risk assessment tools, advanced biomarkers, and personalised lifestyle interventions to dramatically reduce each patient's individual cardiovascular risk. Many patients who come to Dr. Khan with significant risk factors leave with a comprehensive, achievable plan — and are prevented from ever needing interventional procedures.`,
    conditions: [
      { name: 'High Cardiovascular Risk (Primary Prevention)', description: 'Patients with multiple risk factors (diabetes, hypertension, high cholesterol, family history, smoking) but no established heart disease.' },
      { name: 'Secondary Prevention Post-Event', description: 'Aggressive risk factor management after a heart attack, stroke, or PCI to prevent recurrence.' },
      { name: 'Familial Hypercholesterolaemia', description: 'A genetic condition causing very high LDL cholesterol from birth, requiring early identification and treatment.' },
      { name: 'Metabolic Syndrome', description: 'The cluster of abdominal obesity, insulin resistance, hypertension, and dyslipidaemia — a powerful predictor of heart disease.' },
      { name: 'Pre-Diabetes and Diabetes', description: 'Comprehensive cardiometabolic risk management combining glycaemic control with cardiovascular protection.' },
    ],
    procedures: [
      { name: 'Comprehensive Cardiovascular Risk Assessment', description: 'Using Framingham, SCORE2, and Pakistan-specific risk calculators to generate a precise 10-year cardiovascular event risk.', duration: '45–60 minutes' },
      { name: 'Advanced Lipid Panel', description: 'Beyond standard cholesterol — measuring LDL particle size, Lp(a), ApoB, and hs-CRP for a complete risk picture.' },
      { name: 'Coronary Calcium Scoring (CT)', description: 'A 5-minute, low-radiation CT scan that detects calcium deposits in coronary arteries, providing the earliest evidence of atherosclerosis.' },
      { name: 'Personalised Lifestyle Prescription', description: 'A written, detailed plan covering dietary modifications, physical activity targets, stress management, and smoking cessation strategies.' },
      { name: 'Pharmacological Risk Reduction', description: 'Evidence-based prescription of statins, antihypertensives, antiplatelet agents, and newer therapies (GLP-1 agonists, PCSK9 inhibitors) when indicated.' },
    ],
    whatToExpect: [
      'A detailed review of your personal and family medical history.',
      'Full physical examination including blood pressure, BMI, waist circumference.',
      'Blood tests: full lipid panel, blood glucose, HbA1c, renal function, thyroid.',
      'A risk score calculation and visual explanation of your cardiac risk.',
      'A personalised, practical prevention plan you can start immediately.',
      'Follow-up at 3 and 6 months to review progress and adjust the plan.',
    ],
    faqs: [
      { q: 'Who should see a Preventive Cardiologist?', a: 'Anyone with a family history of premature heart disease, risk factors (diabetes, high BP, smoking, obesity), or simply wanting to know their heart health status. Ideally from age 35–40.' },
      { q: 'Do I need to be on statins for life?', a: 'Statins are highly effective and very safe at recommended doses. Most high-risk patients benefit from long-term therapy. Dr. Khan will always explain the evidence and discuss your individual risk-benefit ratio.' },
      { q: 'Can I reverse existing atherosclerosis?', a: 'Intensive lifestyle modification and statin therapy can stabilise and modestly reduce plaque burden. More importantly, they significantly reduce the risk of the plaque rupturing and causing a heart attack.' },
    ],
    preparation: [
      'Fast for 8–10 hours before your appointment for accurate lipid and blood glucose results',
      'Bring all previous blood test results and investigations',
      'Note all medications including supplements and traditional remedies',
      'Bring a list of family history: any first-degree relatives with heart disease, diabetes, or stroke',
    ],
    stats: [
      { label: 'Risk Reduction Achieved', value: '35%' },
      { label: 'Patients Counselled', value: '2,500+' },
      { label: 'Smokers Successfully Quit', value: '68%' },
      { label: 'LDL Target Achievement', value: '81%' },
    ],
  },
  {
    id: 'cardiac-electrophysiology',
    title: 'Cardiac Electrophysiology',
    tagline: 'Precise diagnosis and treatment of heart rhythm disorders — from palpitations to life-threatening arrhythmias.',
    icon: 'activity',
    heroColor: '#8e44ad',
    overview: `Cardiac Electrophysiology (EP) is the subspecialty dedicated to diagnosing and treating disorders of the heart's electrical system — collectively called arrhythmias. These range from benign palpitations to dangerous rhythms like ventricular fibrillation that can cause sudden cardiac death.

Dr. Sarah Khan is trained in the full spectrum of EP procedures including catheter ablation, pacemaker implantation, and implantable cardioverter-defibrillator (ICD) insertion. Using advanced 3D mapping technology, she can identify the precise source of abnormal electrical signals and eliminate them permanently — often curing arrhythmias that were previously managed only with lifelong medication.`,
    conditions: [
      { name: 'Atrial Fibrillation (AF)', description: 'The most common arrhythmia — an irregular, rapid heart rhythm originating in the atria, causing palpitations, fatigue, and significantly increasing stroke risk.' },
      { name: 'Supraventricular Tachycardia (SVT)', description: 'Episodes of rapid heart rate (150–250 bpm) starting above the ventricles, often causing sudden-onset palpitations and dizziness.' },
      { name: 'Ventricular Tachycardia (VT)', description: 'A potentially dangerous rapid heart rhythm originating in the ventricles, often associated with structural heart disease.' },
      { name: 'Heart Block', description: 'A delay or block in the electrical pathway causing the heart to beat too slowly (bradycardia), treated with pacemaker implantation.' },
      { name: 'Wolff-Parkinson-White (WPW) Syndrome', description: 'An accessory electrical pathway connecting the atria and ventricles, causing rapid heart rates and curable with catheter ablation.' },
    ],
    procedures: [
      { name: 'Holter Monitor (24–72 hour ECG)', description: 'A portable ECG recorder worn continuously to capture intermittent arrhythmias that may not occur during a clinic visit.', duration: '24–72 hours monitoring' },
      { name: 'Electrophysiology Study (EPS)', description: 'A catheter-based investigation to map the heart\'s electrical system, identify abnormal pathways, and plan ablation therapy.', duration: '1–3 hours' },
      { name: 'Catheter Ablation (RF / Cryo)', description: 'Using heat or extreme cold through a catheter to eliminate the source of arrhythmia. Highly effective for AF, SVT, and WPW — often providing a permanent cure.', duration: '2–4 hours' },
      { name: 'Pacemaker Implantation', description: 'A small device implanted under the skin to regulate the heart\'s rhythm when it beats too slowly. Modern pacemakers are MRI-compatible and last 8–12 years.', duration: '1–2 hours' },
      { name: 'ICD Implantation', description: 'An implantable cardioverter-defibrillator detects dangerous ventricular arrhythmias and delivers a life-saving shock to restore normal rhythm.', duration: '2–3 hours' },
    ],
    whatToExpect: [
      'A detailed history of your palpitation episodes, triggers, and associated symptoms.',
      '12-lead ECG performed at the time of consultation.',
      'Holter monitor issued if arrhythmia is intermittent.',
      'Echocardiogram to assess heart structure and rule out underlying disease.',
      'Discussion of treatment options: medications, ablation, or device therapy.',
      'Pre-procedure assessment and counselling if ablation or device implantation is planned.',
    ],
    faqs: [
      { q: 'Is catheter ablation safe?', a: 'Ablation is a well-established procedure with a safety profile that has improved dramatically. Serious complications occur in less than 1–2% of cases. For many patients, ablation is significantly safer than a lifetime of antiarrhythmic medications.' },
      { q: 'Will I need a pacemaker for life?', a: 'Yes — once implanted, a pacemaker is a permanent device. However, modern pacemakers are small, reliable, and require only a generator change every 8–12 years when the battery depletes.' },
      { q: 'Can palpitations be dangerous?', a: 'Most palpitations are benign. However, palpitations associated with dizziness, syncope (fainting), chest pain, or a family history of sudden cardiac death warrant urgent evaluation.' },
    ],
    preparation: [
      'Bring all previous ECGs, Holter reports, and echocardiograms',
      'Describe your episodes clearly: how they start, how they stop, frequency, and triggers',
      'Note any medications that helped or worsened symptoms',
      'For ablation procedures: fasting for 6 hours, and plan for a 1–2 night hospital stay',
    ],
    stats: [
      { label: 'Ablation Success Rate', value: '92%' },
      { label: 'Pacemakers Implanted', value: '500+' },
      { label: 'AF Freedom at 1 Year', value: '78%' },
      { label: 'Procedure Experience', value: '10+ Yrs' },
    ],
  },
  {
    id: 'echocardiography',
    title: 'Echocardiography',
    tagline: 'The most powerful tool in cardiac diagnosis — real-time ultrasound imaging of your beating heart.',
    icon: 'scan',
    heroColor: '#00b4d8',
    overview: `Echocardiography uses high-frequency sound waves (ultrasound) to create detailed, real-time images of the heart's chambers, valves, walls, and surrounding structures. It is non-invasive, painless, uses no radiation, and provides an enormous amount of diagnostic information in a single study.

Dr. Sarah Khan's Echocardiography suite at Islamabad Heart Institute offers the full range of echo modalities including advanced 3D echocardiography and speckle-tracking strain imaging — technologies that detect subtle abnormalities years before they become clinically apparent. All studies are performed and reported by Dr. Khan personally, ensuring the highest diagnostic accuracy.`,
    conditions: [
      { name: 'Valvular Heart Disease', description: 'Assessment of aortic stenosis, mitral regurgitation, and other valve abnormalities to determine severity and timing of intervention.' },
      { name: 'Assessment of Heart Function', description: 'Measuring ejection fraction and diastolic function to diagnose and monitor heart failure.' },
      { name: 'Cardiomyopathies', description: 'Diagnosing hypertrophic, dilated, and restrictive cardiomyopathies using advanced strain imaging.' },
      { name: 'Pericardial Disease', description: 'Detecting pericardial effusion (fluid around the heart) and constrictive pericarditis.' },
      { name: 'Pre-Operative Cardiac Assessment', description: 'Mandatory risk evaluation before major non-cardiac surgery in patients with cardiac risk factors.' },
    ],
    procedures: [
      { name: 'Transthoracic Echocardiogram (TTE)', description: 'The standard echo — a gel-covered probe is moved across the chest wall to obtain comprehensive cardiac images. Painless and takes 30–45 minutes.', duration: '30–45 minutes' },
      { name: 'Stress Echocardiography', description: 'Echo images acquired before and immediately after exercise (treadmill) or chemical stress (dobutamine) to detect coronary artery disease and assess valve disease under physiological load.', duration: '60–90 minutes' },
      { name: '3D Echocardiography', description: 'Advanced three-dimensional imaging providing precise volumetric measurements and detailed valve anatomy for surgical planning.', duration: '45–60 minutes' },
      { name: 'Speckle-Tracking Strain Analysis', description: 'Cutting-edge software analysis detecting microscopic abnormalities in heart muscle contractility — valuable in chemotherapy monitoring and subclinical cardiomyopathy.' },
      { name: 'Bubble Contrast Study', description: 'Injecting agitated saline to detect holes between heart chambers (PFO, ASD) and evaluate right-to-left shunts.' },
    ],
    whatToExpect: [
      'No special preparation is required for a standard echo — you may eat and drink normally.',
      'Wear comfortable, loose-fitting clothing that allows easy access to the chest.',
      'You will lie on your left side on an examination couch.',
      'Gel is applied to the chest and a probe is moved across different positions to capture images.',
      'The procedure is completely painless. You will be able to watch the images on screen.',
      'A detailed written report is provided, typically within 24 hours.',
    ],
    faqs: [
      { q: 'How long does an echo take?', a: 'A standard transthoracic echo takes 30–45 minutes. Stress echo with exercise takes 60–90 minutes. Advanced 3D studies may take slightly longer.' },
      { q: 'Is echocardiography safe?', a: 'Echocardiography uses harmless ultrasound waves — no X-rays or radiation. It is completely safe and can be performed in pregnant women and young children.' },
      { q: 'Will I get my results immediately?', a: 'Dr. Khan will discuss the key findings with you immediately after the study. A comprehensive written report with measurements and clinical interpretation is provided within 24 hours.' },
    ],
    preparation: [
      'No fasting required for standard transthoracic echocardiogram',
      'For stress echocardiography: fast for 3 hours, wear comfortable exercise clothing',
      'Bring a referral letter and previous echo reports if available',
      'Inform staff of any known allergies before the study',
    ],
    stats: [
      { label: 'Echos Performed', value: '5,000+' },
      { label: 'Diagnostic Accuracy', value: '98.5%' },
      { label: 'Same-Day Reporting', value: 'Available' },
      { label: 'Technologies Used', value: '2D/3D/Strain' },
    ],
  },
  {
    id: 'hypertension-lipid-management',
    title: 'Hypertension & Lipid Management',
    tagline: 'Evidence-based control of blood pressure and cholesterol — the two most modifiable drivers of cardiovascular disease.',
    icon: 'bar-chart',
    heroColor: '#e67e22',
    overview: `Hypertension (high blood pressure) and dyslipidaemia (abnormal cholesterol) are the two most prevalent and treatable cardiovascular risk factors in Pakistan. Together, they are responsible for the majority of heart attacks, strokes, and kidney disease — yet both are often completely asymptomatic until a catastrophic event occurs.

Dr. Sarah Khan's dedicated Hypertension and Lipid Clinic provides comprehensive, evidence-based management of both conditions. Using the latest international guidelines (ESC, ACC/AHA, Pakistani national guidelines) combined with a deep understanding of the South Asian population's unique risk profile, Dr. Khan provides personalised treatment plans that achieve target blood pressure and lipid levels — significantly reducing lifetime cardiovascular risk.`,
    conditions: [
      { name: 'Essential Hypertension', description: 'The most common form — elevated blood pressure without a single identifiable cause, requiring sustained lifestyle and pharmacological management.' },
      { name: 'Secondary Hypertension', description: 'High blood pressure caused by an underlying condition (renal disease, hormonal disorders) — identification allows targeted treatment.' },
      { name: 'Resistant Hypertension', description: 'Blood pressure that remains above target despite three or more medications — requiring specialist evaluation for secondary causes and advanced therapies.' },
      { name: 'Familial Hypercholesterolaemia (FH)', description: 'Genetic high cholesterol requiring early, aggressive lipid-lowering therapy to prevent premature heart disease.' },
      { name: 'Statin-Intolerant Dyslipidaemia', description: 'For patients who cannot tolerate statins, alternative evidence-based therapies including PCSK9 inhibitors are available.' },
    ],
    procedures: [
      { name: 'Ambulatory Blood Pressure Monitoring (ABPM)', description: 'A device worn for 24 hours that measures blood pressure every 15–30 minutes, eliminating "white coat effect" and providing a true average blood pressure profile.', duration: '24-hour monitoring' },
      { name: 'Comprehensive Lipid Assessment', description: 'Beyond the standard panel — including Lp(a), ApoB, LDL particle number, and hs-CRP to provide a complete cardiovascular lipid risk profile.' },
      { name: 'Renal Artery Ultrasound', description: 'When secondary hypertension from renal artery stenosis is suspected — a Doppler ultrasound of the kidney arteries.' },
      { name: 'Personalised Medication Optimisation', description: 'Selection and titration of antihypertensive and lipid-lowering medications using pharmacogenomic principles and patient-specific factors including renal function, diabetes status, and comorbidities.' },
      { name: 'Structured Lifestyle Intervention', description: 'Dietary counselling (DASH diet, salt restriction, Mediterranean diet), exercise prescription, alcohol reduction, and weight management.' },
    ],
    whatToExpect: [
      'Blood pressure measured in both arms and after 5 minutes of rest.',
      'Full examination including fundoscopy (eye examination) to detect hypertensive damage.',
      'Blood tests: renal function, electrolytes, urine microalbumin, lipid panel, blood glucose.',
      'ECG to assess for left ventricular hypertrophy.',
      'Discussion of target blood pressure and cholesterol levels, and a treatment roadmap.',
      'Ambulatory BP monitor issued if white-coat hypertension is suspected.',
    ],
    faqs: [
      { q: 'What is a safe blood pressure target?', a: 'For most adults, the target is below 130/80 mmHg. Older patients or those with kidney disease may have different targets. Dr. Khan will set an individualised target based on your age, comorbidities, and cardiovascular risk.' },
      { q: 'Do I really need medication if I feel fine?', a: 'Hypertension is called the "silent killer" because it causes no symptoms while silently damaging arteries, the heart, kidneys, and brain. Treatment is about preventing future events, not relieving current symptoms.' },
      { q: 'Can I stop my blood pressure medication if my BP is normal?', a: 'Generally no — blood pressure often returns to elevated levels when medication is stopped. However, with significant lifestyle improvement, some patients on minimal medication can be safely trialled off treatment under supervision.' },
    ],
    preparation: [
      'Do not take your morning blood pressure tablet before the appointment (bring it with you)',
      'Avoid caffeine for 2 hours before BP measurement',
      'Fast for 8–10 hours for fasting lipid and glucose tests',
      'Bring a home blood pressure diary if you monitor at home',
      'Bring all previous investigations including kidney function tests',
    ],
    stats: [
      { label: 'BP Control Rate', value: '89%' },
      { label: 'LDL at Target', value: '83%' },
      { label: 'Patients Managed', value: '3,200+' },
      { label: 'Avg BP Reduction', value: '22 mmHg' },
    ],
  },
];
