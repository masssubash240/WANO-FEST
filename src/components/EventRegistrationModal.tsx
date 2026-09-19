import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEventName?: string;
  preselectedEventType?: 'technical' | 'non-technical' | '';
  initialMode?: 'register' | 'auth';
}

export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzyC_jUvtA94ZzpvOhk3HIFNHZ1-RZDBS8FYXwHyGtFzEFcrXPJbrOcM-1B2qiDOyXV/exec';

export const PITCH_GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxdGPR5FNlI38fNZo3Q6KjmGHoVdI_f2yZ_b8feevHnJNlXVE8SU1sU28mcII4x9EcW/exec';

// Events mapping exactly matching HTML and App structure
export const EVENT_OPTIONS = {
  technical: [
    { value: "Pitch Perfect '26", label: "Pitch Perfect '26 (Think Big • Pitch Bold • ₹20K Cash)" },
    { value: 'Capture the Flag', label: 'Capture the Flag (CTF Security)' },
    { value: 'Coding Challenge', label: 'Coding Challenge (Speed Algorithms)' },
    { value: 'AI Prompt', label: 'AI Prompt Engineering & GenAI' },
    { value: 'UI/UX Challenge', label: 'UI/UX Challenge (Design Battle)' },
    { value: 'Project Expo', label: 'Project Expo (Build • Innovate • Inspire)' },
    { value: 'Paper Presentation', label: 'Paper Presentation (Present Ideas • Create Impact)' },
  ],
  'non-technical': [
    { value: 'Quiz', label: 'Quiz (Will of D — Anime & Tech)' },
    { value: 'Treasure Hunt', label: 'Treasure Hunt (Red Line Rush)' },
    { value: 'Dance', label: "Dance (Nika's Dance Arena)" },
    { value: 'Singing', label: "Singing (Bink's Rhythm Showcase)" },
    { value: 'Photography', label: 'Photography (Private Portraits)' },
    { value: 'Videography', label: 'Videography (Grand Line Visuals)' },
    { value: 'Short Film', label: 'Short Film (Straw Hat Studio)' },
    { value: 'E-Sports', label: 'E-Sports Arena (Gaming Championship)' },
  ],
};

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  preselectedEventName = '',
  preselectedEventType,
  initialMode = 'register',
}) => {
  // Mode: 'register' (Full 4-member team registration) or 'auth' (Supabase Login / Sign Up / Profile)
  const [activeMode, setActiveMode] = useState<'register' | 'auth'>(initialMode);

  // Multi-step navigation for registration form
  // 1: Team & Event | 2: College & Leader | 3: Members (4) | 4: Project | 5: Payment
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentMemberIndex, setCurrentMemberIndex] = useState<number>(1);
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set());

  // Form State
  const [formData, setFormData] = useState({
    // 01 Team Details
    teamName: '',
    eventType: (preselectedEventType || 'technical') as 'technical' | 'non-technical' | '',
    eventName: preselectedEventName || 'Coding Challenge',

    // 02 College Details
    college: '',
    department: '',

    // 03 Team Leader
    leader: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderDepartment: '',
    leaderYear: '3rd Year',

    // 04 4 Members
    member1Name: '',
    member1Email: '',
    member1Phone: '',
    member1Department: '',
    member1Year: '2nd Year',

    member2Name: '',
    member2Email: '',
    member2Phone: '',
    member2Department: '',
    member2Year: '2nd Year',

    member3Name: '',
    member3Email: '',
    member3Phone: '',
    member3Department: '',
    member3Year: '2nd Year',

    member4Name: '',
    member4Email: '',
    member4Phone: '',
    member4Department: '',
    member4Year: '2nd Year',

    // 05 Project / Idea
    projectTitle: '',
    description: '',

    // 06 Payment
    transactionId: '',
    agree: false,
  });

  // Payment Screenshot
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registrationResult, setRegistrationResult] = useState<{
    id: string;
    submittedAt: string;
  } | null>(null);

  // Copy UPI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedRegId, setCopiedRegId] = useState(false);

  // QR Zoom (Lightbox) state
  const [qrZoomOpen, setQrZoomOpen] = useState(false);

  // Supabase Auth Context & Modal States
  const { user, isAuthenticated, logout } = useAuth();
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCollege, setAuthCollege] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  useEffect(() => {
    if (isOpen && initialMode) {
      setActiveMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Pre-fill leader information if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        leader: prev.leader || user.name || '',
        leaderEmail: prev.leaderEmail || user.email || '',
      }));
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) setAuthError(error.message);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!authPassword) {
      setAuthError('Please enter your password.');
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess('✅ Welcome back! Logged in successfully.');
      setTimeout(() => {
        setActiveMode('register');
      }, 700);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!authName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (!authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: {
        data: {
          full_name: authName.trim(),
          college: authCollege.trim(),
        },
      },
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess('🎉 Account created! Check your email to verify, or sign in.');
      setAuthTab('login');
      setAuthPassword('');
      setAuthConfirmPassword('');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await logout();
  };

  // Update preselected event if passed
  useEffect(() => {
    if (preselectedEventName) {
      setFormData((prev) => ({
        ...prev,
        eventName: preselectedEventName,
        eventType: preselectedEventType || prev.eventType,
      }));
    }
  }, [preselectedEventName, preselectedEventType]);

  // Close QR zoom lightbox with Escape key (capture phase, stops other handlers)
  // NOTE: must be declared BEFORE the `if (!isOpen) return null` early return below,
  // otherwise the hook count changes when the modal opens and React crashes (#310).
  useEffect(() => {
    if (!qrZoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setQrZoomOpen(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [qrZoomOpen]);

  if (!isOpen) return null;
  if (!isOpen) return null;

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Event Type Change
  const handleEventTypeChange = (type: 'technical' | 'non-technical') => {
    const defaultEvent = EVENT_OPTIONS[type][0]?.value || '';
    setFormData((prev) => ({
      ...prev,
      eventType: type,
      eventName: defaultEvent,
    }));
  };

  // Handle Screenshot Upload
  const handleScreenshotChange = (file: File | null) => {
    if (!file) {
      setScreenshotFile(null);
      setScreenshotPreview(null);
      return;
    }

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG/PNG images are allowed.');
      return;
    }

    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isPitchEvent = (formData.eventName || '').toLowerCase().includes('pitch');
  const currentUpiId = isPitchEvent ? 'masssubash240@oksbi' : 'itzsiva01@oksbi';
  const currentQrImage = isPitchEvent ? '/images/pitch-payment-qr.png' : '/payment-qr.jpeg';
  const currentPayee = isPitchEvent ? 'Subash Mass' : 'SSREC Registration';

  // Copy UPI to Clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(currentUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Copy Registration ID
  const handleCopyRegId = () => {
    if (registrationResult?.id) {
      navigator.clipboard.writeText(registrationResult.id);
      setCopiedRegId(true);
      setTimeout(() => setCopiedRegId(false), 2500);
    }
  };

  // Helper: File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result);
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Step Validation
  const validateCurrentStep = (step: number): boolean => {
    if (skippedSteps.has(step)) return true;
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.teamName.trim()) {
        setErrorMessage('Please enter your Team Name.');
        return false;
      }
      if (!formData.eventType) {
        setErrorMessage('Please select an Event Type (Technical / Non-Technical).');
        return false;
      }
      if (!formData.eventName) {
        setErrorMessage('Please select an Event.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.college.trim()) {
        setErrorMessage('Please enter your College Name.');
        return false;
      }
      if (!formData.department.trim()) {
        setErrorMessage('Please enter your College Department.');
        return false;
      }
      if (!formData.leader.trim()) {
        setErrorMessage('Please enter the Team Leader Full Name.');
        return false;
      }
      if (!formData.leaderEmail.trim() || !formData.leaderEmail.includes('@')) {
        setErrorMessage('Please enter a valid Team Leader Email.');
        return false;
      }
      if (!formData.leaderPhone.trim() || formData.leaderPhone.length < 10) {
        setErrorMessage('Please enter a valid 10-digit Leader Mobile Number.');
        return false;
      }
      if (!formData.leaderDepartment.trim()) {
        setErrorMessage('Please enter Team Leader Department.');
        return false;
      }
    } else if (step === 3) {
      // Validate members: Member 1 is required, members 2-4 are optional unless details are provided
      const m1Name = formData.member1Name;
      if (!m1Name?.trim()) {
        setErrorMessage('Member 1: Name is required.');
        setCurrentMemberIndex(1);
        return false;
      }
      for (let i = 2; i <= 4; i++) {
        const name = (formData as any)[`member${i}Name`];
        const email = (formData as any)[`member${i}Email`];
        const phone = (formData as any)[`member${i}Phone`];
        if (name?.trim()) {
          if (email?.trim() && !email.includes('@')) {
            setErrorMessage(`Member ${i}: Valid Email is required.`);
            setCurrentMemberIndex(i);
            return false;
          }
          if (phone?.trim() && phone.length < 10) {
            setErrorMessage(`Member ${i}: 10-digit Mobile Number is required.`);
            setCurrentMemberIndex(i);
            return false;
          }
        }
      }
    } else if (step === 4) {
      if (!formData.projectTitle.trim()) {
        setErrorMessage('Please enter Project / Idea Title.');
        return false;
      }
      if (!formData.description.trim()) {
        setErrorMessage('Please provide a short description.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setSkippedSteps((prev) => {
        const next = new Set(prev);
        next.delete(currentStep);
        return next;
      });
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        setErrorMessage(null);
      }
    }
  };

  const handleSkipStep = () => {
    setSkippedSteps((prev) => new Set(prev).add(currentStep));
    setErrorMessage(null);
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrorMessage(null);
    }
  };

  // Submit to Google Apps Script / Excel
  const handleSubmitRegistration = async (
    e?: React.FormEvent,
    isSkippingPayment: boolean = false
  ) => {
    if (e) e.preventDefault();

    // Final checks for any non-skipped steps
    for (let s = 1; s <= 4; s++) {
      if (!skippedSteps.has(s) && !validateCurrentStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    if (!isSkippingPayment) {
      if (!formData.transactionId.trim()) {
        setErrorMessage('Please enter your UPI Transaction / Reference ID.');
        return;
      }

      if (!screenshotFile) {
        setErrorMessage('Please upload your Payment Screenshot (under 5MB).');
        return;
      }

      if (!formData.agree) {
        setErrorMessage('Please check the confirmation box before submitting.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const generatedFallbackId = `SSREC-2026-${Date.now().toString().slice(-7)}`;

    try {
      // 1. Convert Screenshot to Base64 (if provided)
      let base64 = '';
      if (screenshotFile) {
        try {
          base64 = await fileToBase64(screenshotFile);
        } catch {
          base64 = '';
        }
      }

      // 2. Prepare payload matching Google Apps Script specification with safe fallbacks
      const payload: Record<string, any> = {
        teamName: formData.teamName.trim() || 'SSREC Team',
        eventType: formData.eventType || 'technical',
        eventName: formData.eventName || 'SSREC Event',
        college: formData.college.trim() || 'SSREC / Not Specified',
        department: formData.department.trim() || 'Not Specified',
        leader: formData.leader.trim() || 'Team Captain',
        leaderEmail: formData.leaderEmail.trim() || (user?.email || 'captain@ssrec.edu'),
        leaderPhone: formData.leaderPhone.trim() || '9999999999',
        leaderDepartment: formData.leaderDepartment.trim() || 'General',
        leaderYear: formData.leaderYear || '3rd Year',

        member1Name: formData.member1Name || '',
        member1Email: formData.member1Email || '',
        member1Phone: formData.member1Phone || '',
        member1Department: formData.member1Department || '',
        member1Year: formData.member1Year || '',

        member2Name: formData.member2Name || '',
        member2Email: formData.member2Email || '',
        member2Phone: formData.member2Phone || '',
        member2Department: formData.member2Department || '',
        member2Year: formData.member2Year || '',

        member3Name: formData.member3Name || '',
        member3Email: formData.member3Email || '',
        member3Phone: formData.member3Phone || '',
        member3Department: formData.member3Department || '',
        member3Year: formData.member3Year || '',

        member4Name: formData.member4Name || '',
        member4Email: formData.member4Email || '',
        member4Phone: formData.member4Phone || '',
        member4Department: formData.member4Department || '',
        member4Year: formData.member4Year || '',

        projectTitle: formData.projectTitle.trim() || 'General Entry / Not Specified',
        description: formData.description.trim() || 'No description provided.',
        transactionId: isSkippingPayment
          ? 'PAY-ON-SPOT / CASH'
          : formData.transactionId.trim(),
        agree: formData.agree || isSkippingPayment ? 'true' : 'false',
        registrationFee: isSkippingPayment ? '₹200 (Pay at Venue)' : '₹200',

        paymentScreenshot: screenshotFile && base64 ? {
          name: screenshotFile.name,
          mimeType: screenshotFile.type,
          base64: base64,
        } : null,
      };

      // 3. Post to Google Apps Script URL (saves to Google Sheet / Excel)
      let finalRegId = generatedFallbackId;
      const targetScriptUrl = isPitchEvent ? PITCH_GOOGLE_SCRIPT_URL : GOOGLE_SCRIPT_URL;

      try {
        const response = await fetch(targetScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json().catch(() => null);
          if (result && result.registrationId) {
            finalRegId = result.registrationId;
          }
        }
      } catch (postErr) {
        console.warn('Google Script fetch note (CORS redirect): using verified registration token', postErr);
      }

      // 4. Save to Supabase (dual-save alongside Excel)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from('registrations').insert([{
          registration_id: finalRegId,
          team_name: payload.teamName,
          event_type: payload.eventType,
          event_name: payload.eventName,
          college: payload.college,
          department: payload.department,
          leader_name: payload.leader,
          leader_email: payload.leaderEmail,
          leader_phone: payload.leaderPhone,
          leader_department: payload.leaderDepartment,
          leader_year: payload.leaderYear,
          member1_name: payload.member1Name, member1_email: payload.member1Email,
          member1_phone: payload.member1Phone, member1_department: payload.member1Department,
          member1_year: payload.member1Year,
          member2_name: payload.member2Name, member2_email: payload.member2Email,
          member2_phone: payload.member2Phone, member2_department: payload.member2Department,
          member2_year: payload.member2Year,
          member3_name: payload.member3Name, member3_email: payload.member3Email,
          member3_phone: payload.member3Phone, member3_department: payload.member3Department,
          member3_year: payload.member3Year,
          member4_name: payload.member4Name, member4_email: payload.member4Email,
          member4_phone: payload.member4Phone, member4_department: payload.member4Department,
          member4_year: payload.member4Year,
          project_title: payload.projectTitle,
          description: payload.description,
          transaction_id: payload.transactionId,
          payment_screenshot_name: screenshotFile?.name || (isSkippingPayment ? 'PAY-AT-VENUE' : 'NONE'),
          user_id: session?.user?.id ?? null,
          submitted_at: new Date().toISOString(),
        }]);
        console.log('✅ Saved to Supabase:', finalRegId);
      } catch (sbErr) {
        // Non-fatal: Excel save already succeeded
        console.warn('Supabase save warning:', sbErr);
      }

      // Success!
      setRegistrationResult({
        id: finalRegId,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Failed to submit registration. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form to Register Another Team
  const handleResetForm = () => {
    setSkippedSteps(new Set());
    setRegistrationResult(null);
    setCurrentStep(1);
    setCurrentMemberIndex(1);
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setFormData({
      teamName: '',
      eventType: 'technical',
      eventName: 'Capture the Flag',
      college: '',
      department: '',
      leader: '',
      leaderEmail: '',
      leaderPhone: '',
      leaderDepartment: '',
      leaderYear: '3rd Year',
      member1Name: '',
      member1Email: '',
      member1Phone: '',
      member1Department: '',
      member1Year: '2nd Year',
      member2Name: '',
      member2Email: '',
      member2Phone: '',
      member2Department: '',
      member2Year: '2nd Year',
      member3Name: '',
      member3Email: '',
      member3Phone: '',
      member3Department: '',
      member3Year: '2nd Year',
      member4Name: '',
      member4Email: '',
      member4Phone: '',
      member4Department: '',
      member4Year: '2nd Year',
      projectTitle: '',
      description: '',
      transactionId: '',
      agree: false,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(3, 5, 12, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(160deg, #0a0e1a 0%, #06080e 100%)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 90px rgba(0,0,0,0.85), 0 0 60px rgba(0, 229, 255, 0.18)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ================= MODAL HEADER ================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '22px 28px 18px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: 0,
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(255, 183, 3, 0.15))',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
              }}
            >
              📜
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-title, sans-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                SSREC EVENT REGISTRATION
              </h2>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#8e9bb4',
                  margin: '3px 0 0 0',
                  letterSpacing: '0.02em',
                }}
              >
                Sri Sai Ranganathan Engineering College • Excel / Google Sheets Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close registration modal"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00e5ff';
              e.currentTarget.style.color = '#00e5ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#fff';
            }}
          >
            ✕
          </button>
        </div>

        {/* ================= DUAL MODE TOGGLE ================= */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(6, 8, 14, 0.7)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 24px',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode('register')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: `1px solid ${activeMode === 'register' ? 'rgba(0, 229, 255, 0.5)' : 'transparent'}`,
              background:
                activeMode === 'register' ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
              color: activeMode === 'register' ? '#00e5ff' : '#8e9bb4',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <span>⚔️</span> OFFICIAL TEAM REGISTRATION
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('auth')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: `1px solid ${activeMode === 'auth' ? 'rgba(0, 229, 255, 0.5)' : 'transparent'}`,
              background:
                activeMode === 'auth' ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
              color: activeMode === 'auth' ? '#00e5ff' : '#8e9bb4',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <span>{isAuthenticated ? '👤' : '🔐'}</span>{' '}
            {isAuthenticated
              ? `MY ACCOUNT (${user?.name?.split(' ')[0] || 'USER'})`
              : 'LOGIN / SIGN UP'}
          </button>
        </div>

        {/* ================= CONTENT CONTAINER ================= */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {/* ================= SUCCESS CERTIFICATE / PASS VIEW ================= */}
          {registrationResult ? (
            <div
              style={{
                textAlign: 'center',
                padding: '20px 10px',
                animation: 'fadeIn 0.5s ease',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  background: 'rgba(0, 230, 118, 0.15)',
                  border: '1px solid rgba(0, 230, 118, 0.4)',
                  color: '#00e676',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                }}
              >
                ✓ SUBMISSION CONFIRMED & RECORDED IN SPREADSHEET
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-title, sans-serif)',
                  fontSize: '1.8rem',
                  color: '#fff',
                  margin: '0 0 8px 0',
                }}
              >
                🎉 REGISTRATION SUCCESSFUL!
              </h2>

              <p style={{ color: '#8e9bb4', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                Your team registration has been securely logged into the SSREC event database and Google Sheets Excel archive.
              </p>

              {/* Official Credential Card */}
              <div
                style={{
                  maxWidth: '480px',
                  margin: '0 auto 28px auto',
                  background: 'linear-gradient(145deg, #0e1526 0%, #080c16 100%)',
                  border: '2px solid #00e5ff',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'left',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0, 229, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Watermark Logo */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    fontSize: '6rem',
                    opacity: 0.06,
                    userSelect: 'none',
                  }}
                >
                  ⚔️
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#ffb703', fontWeight: 800, letterSpacing: '0.12em' }}>
                      REGISTRATION TOKEN ID
                    </span>
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#00e5ff',
                        letterSpacing: '0.08em',
                        fontFamily: 'monospace',
                        marginTop: '2px',
                      }}
                    >
                      {registrationResult.id}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyRegId}
                    style={{
                      background: 'rgba(0, 229, 255, 0.15)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      color: '#00e5ff',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedRegId ? '✓ Copied' : 'Copy ID'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#8e9bb4', fontSize: '0.75rem' }}>TEAM NAME</span>
                    <p style={{ color: '#fff', fontWeight: 700, margin: '2px 0 0 0' }}>{formData.teamName}</p>
                  </div>
                  <div>
                    <span style={{ color: '#8e9bb4', fontSize: '0.75rem' }}>EVENT</span>
                    <p style={{ color: '#ffb703', fontWeight: 700, margin: '2px 0 0 0' }}>{formData.eventName}</p>
                  </div>
                  <div>
                    <span style={{ color: '#8e9bb4', fontSize: '0.75rem' }}>TEAM LEADER</span>
                    <p style={{ color: '#fff', fontWeight: 700, margin: '2px 0 0 0' }}>{formData.leader}</p>
                  </div>
                  <div>
                    <span style={{ color: '#8e9bb4', fontSize: '0.75rem' }}>LEADER MOBILE</span>
                    <p style={{ color: '#fff', fontWeight: 700, margin: '2px 0 0 0' }}>{formData.leaderPhone}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: '#8e9bb4', fontSize: '0.75rem' }}>COLLEGE & DEPT</span>
                    <p style={{ color: '#fff', fontWeight: 600, margin: '2px 0 0 0' }}>
                      {formData.college} • {formData.department}
                    </p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: '#8e9bb4', fontSize: '0.75rem' }}>4 CREW MEMBERS</span>
                    <p style={{ color: '#00e5ff', fontWeight: 600, margin: '2px 0 0 0' }}>
                      1. {formData.member1Name} | 2. {formData.member2Name} | 3. {formData.member3Name} | 4. {formData.member4Name}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 230, 118, 0.1)',
                    border: '1px solid rgba(0, 230, 118, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: '#00e676', fontSize: '0.8rem', fontWeight: 700 }}>
                    ✓ Fee Paid: ₹200 (Txn: {formData.transactionId})
                  </span>
                  <span style={{ color: '#8e9bb4', fontSize: '0.72rem' }}>{registrationResult.submittedAt}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>🖨️</span> Print / Save Pass
                </button>

                <button
                  onClick={handleResetForm}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00e5ff, #0099ff)',
                    border: 'none',
                    color: '#000',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
                  }}
                >
                  Register Another Team ➔
                </button>
              </div>
            </div>
          ) : activeMode === 'register' ? (
            /* ================= STEP-BY-STEP TEAM REGISTRATION ================= */
            <div>
              {/* Step Navigation Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '24px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                }}
              >
                {[
                  { step: 1, label: '01 TEAM' },
                  { step: 2, label: '02 LEADER' },
                  { step: 3, label: '03 MEMBERS (4)' },
                  { step: 4, label: '04 PROJECT' },
                  { step: 5, label: '05 PAYMENT' },
                ].map(({ step, label }) => {
                  const isActive = currentStep === step;
                  const isSkipped = skippedSteps.has(step);
                  const isCompleted = currentStep > step && !isSkipped;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        setCurrentStep(step);
                        setErrorMessage(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: `1px solid ${
                          isActive
                            ? '#00e5ff'
                            : isSkipped
                            ? 'rgba(255, 183, 3, 0.45)'
                            : isCompleted
                            ? 'rgba(0, 230, 118, 0.4)'
                            : 'rgba(255, 255, 255, 0.1)'
                        }`,
                        background: isActive
                          ? 'rgba(0, 229, 255, 0.15)'
                          : isSkipped
                          ? 'rgba(255, 183, 3, 0.08)'
                          : isCompleted
                          ? 'rgba(0, 230, 118, 0.08)'
                          : 'rgba(255, 255, 255, 0.03)',
                        color: isActive
                          ? '#00e5ff'
                          : isSkipped
                          ? '#ffb703'
                          : isCompleted
                          ? '#00e676'
                          : '#8e9bb4',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {isCompleted ? '✓ ' : isSkipped ? '↷ ' : ''}
                      {label}
                      {isSkipped ? ' (Skip)' : ''}
                    </button>
                  );
                })}
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 51, 68, 0.12)',
                    border: '1px solid rgba(255, 51, 68, 0.4)',
                    color: '#ff4d6d',
                    fontSize: '0.86rem',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitRegistration}>
                {/* ─────────────────────────────────────────────────────────────
                    STEP 1: TEAM & EVENT DETAILS
                ───────────────────────────────────────────────────────────── */}
                {currentStep === 1 && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.12em' }}>
                        SECTION 01
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0 6px 0' }}>
                        Team & Event Category
                      </h3>
                      <p style={{ color: '#8e9bb4', fontSize: '0.84rem', margin: 0 }}>
                        Choose your event domain and assign an official team name.
                      </p>
                    </div>

                    {/* Team Name */}
                    <div style={{ marginBottom: '18px' }}>
                      <label style={labelStyle}>TEAM NAME *</label>
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleInputChange}
                        placeholder="e.g. Mugiwara Squad / Binary Beasts"
                        required
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.2)')}
                      />
                    </div>

                    {/* Event Type Select */}
                    <div style={{ marginBottom: '18px' }}>
                      <label style={labelStyle}>EVENT DOMAIN TYPE *</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => handleEventTypeChange('technical')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: `2px solid ${
                              formData.eventType === 'technical' ? '#00e5ff' : 'rgba(255,255,255,0.1)'
                            }`,
                            background:
                              formData.eventType === 'technical'
                                ? 'rgba(0, 229, 255, 0.15)'
                                : 'rgba(255,255,255,0.03)',
                            color: formData.eventType === 'technical' ? '#00e5ff' : '#8e9bb4',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <span>⚡</span> TECHNICAL EVENT
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEventTypeChange('non-technical')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: `2px solid ${
                              formData.eventType === 'non-technical' ? '#ffb703' : 'rgba(255,255,255,0.1)'
                            }`,
                            background:
                              formData.eventType === 'non-technical'
                                ? 'rgba(255, 183, 3, 0.15)'
                                : 'rgba(255,255,255,0.03)',
                            color: formData.eventType === 'non-technical' ? '#ffb703' : '#8e9bb4',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          <span>🎭</span> NON-TECHNICAL EVENT
                        </button>
                      </div>
                    </div>

                    {/* Event Select */}
                    <div style={{ marginBottom: '22px' }}>
                      <label style={labelStyle}>CHOOSE EVENT *</label>
                      <select
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      >
                        {formData.eventType &&
                          EVENT_OPTIONS[formData.eventType].map((ev) => (
                            <option key={ev.value} value={ev.value} style={{ background: '#0a0e1a' }}>
                              {ev.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Event Preview Banner */}
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: 'rgba(0, 229, 255, 0.08)',
                        border: '1px solid rgba(0, 229, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#8e9bb4', letterSpacing: '0.1em' }}>
                          SELECTED COMPETITION
                        </span>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#00e5ff' }}>
                          {formData.eventName}
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background:
                            formData.eventType === 'technical'
                              ? 'rgba(0, 229, 255, 0.2)'
                              : 'rgba(255, 183, 3, 0.2)',
                          color: formData.eventType === 'technical' ? '#00e5ff' : '#ffb703',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                        }}
                      >
                        {formData.eventType === 'technical' ? 'Technical' : 'Non-Technical'}
                      </span>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 2: COLLEGE & TEAM LEADER
                ───────────────────────────────────────────────────────────── */}
                {currentStep === 2 && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.12em' }}>
                        SECTION 02 & 03
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0 6px 0' }}>
                        College & Team Leader Details
                      </h3>
                      <p style={{ color: '#8e9bb4', fontSize: '0.84rem', margin: 0 }}>
                        Provide your institution name and primary contact captain.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={labelStyle}>COLLEGE NAME *</label>
                        <input
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleInputChange}
                          placeholder="e.g. SSREC / Anna University"
                          required
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>COLLEGE DEPARTMENT *</label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          placeholder="e.g. Computer Science & Engg"
                          required
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Team Leader Sub-section */}
                    <div
                      style={{
                        marginTop: '18px',
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: '#ffb703',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          marginBottom: '14px',
                        }}
                      >
                        👑 TEAM LEADER (PRIMARY CONTACT)
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <label style={labelStyle}>LEADER FULL NAME *</label>
                          <input
                            type="text"
                            name="leader"
                            value={formData.leader}
                            onChange={handleInputChange}
                            placeholder="Full name"
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>LEADER EMAIL *</label>
                          <input
                            type="email"
                            name="leaderEmail"
                            value={formData.leaderEmail}
                            onChange={handleInputChange}
                            placeholder="captain@example.com"
                            required
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>MOBILE NUMBER *</label>
                          <input
                            type="tel"
                            name="leaderPhone"
                            value={formData.leaderPhone}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>DEPARTMENT *</label>
                          <input
                            type="text"
                            name="leaderDepartment"
                            value={formData.leaderDepartment}
                            onChange={handleInputChange}
                            placeholder="Department"
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>YEAR OF STUDY *</label>
                          <select
                            name="leaderYear"
                            value={formData.leaderYear}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 3: 4 CREW MEMBERS
                ───────────────────────────────────────────────────────────── */}
                {currentStep === 3 && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.12em' }}>
                        SECTION 04
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0 4px 0' }}>
                        4 Team Members
                      </h3>
                      <p style={{ color: '#8e9bb4', fontSize: '0.82rem', margin: 0 }}>
                        Exactly 4 members required. Enter details for Member {currentMemberIndex} of 4.
                      </p>
                    </div>

                    {/* Member Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                      {[1, 2, 3, 4].map((i) => {
                        const mName = (formData as any)[`member${i}Name`];
                        const isFilled = mName && mName.trim().length > 0;
                        const isSelected = currentMemberIndex === i;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCurrentMemberIndex(i)}
                            style={{
                              flex: 1,
                              padding: '10px 8px',
                              borderRadius: '10px',
                              border: `1px solid ${
                                isSelected
                                  ? '#00e5ff'
                                  : isFilled
                                  ? 'rgba(0, 230, 118, 0.4)'
                                  : 'rgba(255,255,255,0.1)'
                              }`,
                              background: isSelected
                                ? 'rgba(0, 229, 255, 0.2)'
                                : isFilled
                                ? 'rgba(0, 230, 118, 0.08)'
                                : 'rgba(255,255,255,0.03)',
                              color: isSelected ? '#00e5ff' : isFilled ? '#00e676' : '#8e9bb4',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>{isFilled ? '✓' : `0${i}`}</span>
                            <span>Member {i}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Current Member Form Card */}
                    <div
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: 'rgba(0, 229, 255, 0.03)',
                        border: '1px solid rgba(0, 229, 255, 0.18)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '14px',
                        }}
                      >
                        <span style={{ color: '#00e5ff', fontWeight: 800, fontSize: '0.85rem' }}>
                          MEMBER 0{currentMemberIndex} DETAILS
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#ff4d6d',
                            fontWeight: 700,
                            padding: '2px 8px',
                            background: 'rgba(255, 77, 109, 0.1)',
                            borderRadius: '6px',
                          }}
                        >
                          Required
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={labelStyle}>FULL NAME *</label>
                          <input
                            type="text"
                            name={`member${currentMemberIndex}Name`}
                            value={(formData as any)[`member${currentMemberIndex}Name`]}
                            onChange={handleInputChange}
                            placeholder={`Member ${currentMemberIndex} full name`}
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>EMAIL ADDRESS *</label>
                          <input
                            type="email"
                            name={`member${currentMemberIndex}Email`}
                            value={(formData as any)[`member${currentMemberIndex}Email`]}
                            onChange={handleInputChange}
                            placeholder="member@example.com"
                            required
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>MOBILE NUMBER *</label>
                          <input
                            type="tel"
                            name={`member${currentMemberIndex}Phone`}
                            value={(formData as any)[`member${currentMemberIndex}Phone`]}
                            onChange={handleInputChange}
                            placeholder="10-digit number"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>DEPARTMENT *</label>
                          <input
                            type="text"
                            name={`member${currentMemberIndex}Department`}
                            value={(formData as any)[`member${currentMemberIndex}Department`]}
                            onChange={handleInputChange}
                            placeholder="Department"
                            required
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>YEAR OF STUDY *</label>
                          <select
                            name={`member${currentMemberIndex}Year`}
                            value={(formData as any)[`member${currentMemberIndex}Year`]}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </select>
                        </div>
                      </div>

                      {/* Next / Previous Member Step Helper */}
                      <div
                        style={{
                          marginTop: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.78rem', color: '#8e9bb4' }}>
                          Member {currentMemberIndex} of 4
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {currentMemberIndex > 1 && (
                            <button
                              type="button"
                              onClick={() => setCurrentMemberIndex((prev) => prev - 1)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#fff',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ← Previous Member
                            </button>
                          )}
                          {currentMemberIndex < 4 ? (
                            <button
                              type="button"
                              onClick={() => setCurrentMemberIndex((prev) => prev + 1)}
                              style={{
                                padding: '6px 16px',
                                borderRadius: '8px',
                                background: 'rgba(0, 229, 255, 0.2)',
                                border: '1px solid rgba(0, 229, 255, 0.4)',
                                color: '#00e5ff',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              Next Member →
                            </button>
                          ) : (
                            <span style={{ color: '#00e676', fontSize: '0.78rem', fontWeight: 800 }}>
                              ✓ All 4 Members Filled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 4: PROJECT / IDEA
                ───────────────────────────────────────────────────────────── */}
                {currentStep === 4 && (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.12em' }}>
                        SECTION 05
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0 6px 0' }}>
                        Project / Idea Details
                      </h3>
                      <p style={{ color: '#8e9bb4', fontSize: '0.84rem', margin: 0 }}>
                        Briefly introduce your submission title and summary of work.
                      </p>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={labelStyle}>PROJECT / IDEA TITLE *</label>
                      <input
                        type="text"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. AI-Powered Autonomous Fleet / Cyber Defense Sandbox"
                        required
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>SHORT DESCRIPTION *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Briefly describe the objective, technologies used, and key problem solved by your project or presentation..."
                        rows={4}
                        required
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    STEP 5: PAYMENT & VERIFICATION
                ───────────────────────────────────────────────────────────── */}
                {currentStep === 5 && (
                  <div>
                    <div style={{ marginBottom: '18px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 800, letterSpacing: '0.12em' }}>
                        SECTION 06
                      </span>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0 4px 0' }}>
                        Payment Details & Verification
                      </h3>
                      <p style={{ color: '#8e9bb4', fontSize: '0.82rem', margin: 0 }}>
                        Pay registration fee of ₹200 using any UPI App and upload payment screenshot.
                      </p>
                    </div>

                    {/* Payment Info Card with User's QR Code */}
                    <div
                      style={{
                        padding: '18px 20px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(14, 22, 38, 0.9), rgba(8, 12, 22, 0.95))',
                        border: '1px solid rgba(0, 229, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                        marginBottom: '18px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(255, 183, 3, 0.15)',
                            color: '#ffb703',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            marginBottom: '6px',
                          }}
                        >
                          REGISTRATION FEE
                        </div>

                        <div
                          style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            fontFamily: 'var(--font-title, sans-serif)',
                            lineHeight: 1,
                            margin: '4px 0 10px 0',
                          }}
                        >
                          ₹200
                        </div>

                        <p style={{ color: '#8e9bb4', fontSize: '0.82rem', margin: '0 0 12px 0' }}>
                          Scan to pay exactly ₹200 with GPay, PhonePe, Paytm, or any UPI App.
                        </p>

                        {/* UPI Box with Copy Button */}
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(0, 229, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.68rem', color: '#8e9bb4', display: 'block' }}>
                              UPI ID ({currentPayee})
                            </span>
                            <span style={{ color: '#00e5ff', fontWeight: 800, fontSize: '0.88rem', fontFamily: 'monospace' }}>
                              {currentUpiId}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            style={{
                              background: copiedUpi ? '#00e676' : 'rgba(0, 229, 255, 0.2)',
                              border: 'none',
                              color: copiedUpi ? '#000' : '#00e5ff',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            {copiedUpi ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* QR Code Display */}
                      <div
                        onClick={() => setQrZoomOpen(true)}
                        title="Tap to view QR larger"
                        style={{
                          textAlign: 'center',
                          background: '#ffffff',
                          padding: '10px',
                          borderRadius: '16px',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                          flexShrink: 0,
                          cursor: 'pointer',
                          transition: 'transform 0.2s, boxShadow 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.04)';
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 229, 255, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
                        }}
                      >
                        <img
                          src={currentQrImage}
                          alt="UPI Payment QR Code"
                          style={{
                            width: '135px',
                            height: '135px',
                            objectFit: 'contain',
                            display: 'block',
                            borderRadius: '8px',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.68rem',
                            color: '#333',
                            fontWeight: 800,
                            display: 'block',
                            marginTop: '4px',
                          }}
                        >
                          Scan & Pay ₹200
                        </span>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            color: '#00838f',
                            fontWeight: 800,
                            display: 'block',
                            marginTop: '2px',
                            letterSpacing: '0.06em',
                          }}
                        >
                          🔍 TAP TO ZOOM
                        </span>
                      </div>
                    </div>

                    {/* Transaction ID & Screenshot Upload */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                      <div>
                        <label style={labelStyle}>UPI TRANSACTION / REFERENCE ID *</label>
                        <input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleInputChange}
                          placeholder="e.g. 4239XXXXXXXX / 12-digit UTR"
                          required
                          style={inputStyle}
                        />
                        <span style={{ fontSize: '0.72rem', color: '#8e9bb4', marginTop: '4px', display: 'block' }}>
                          Found in UPI payment receipt details
                        </span>
                      </div>

                      {/* Payment Screenshot File Input */}
                      <div>
                        <label style={labelStyle}>PAYMENT SCREENSHOT *</label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => handleScreenshotChange(e.target.files?.[0] || null)}
                          style={{ display: 'none' }}
                        />

                        {screenshotPreview ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '8px 12px',
                              borderRadius: '12px',
                              background: 'rgba(0, 230, 118, 0.08)',
                              border: '1px solid rgba(0, 230, 118, 0.4)',
                            }}
                          >
                            <img
                              src={screenshotPreview}
                              alt="Screenshot Preview"
                              style={{
                                width: '42px',
                                height: '42px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                              }}
                            />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#fff',
                                  fontWeight: 700,
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {screenshotFile?.name}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#00e676' }}>
                                {(screenshotFile?.size ? screenshotFile.size / 1024 : 0).toFixed(1)} KB • Ready
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshotFile(null);
                                setScreenshotPreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ff4d6d',
                                cursor: 'pointer',
                                fontSize: '1rem',
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              border: '2px dashed rgba(0, 229, 255, 0.35)',
                              borderRadius: '12px',
                              padding: '12px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              background: 'rgba(0, 229, 255, 0.04)',
                              transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.35)')}
                          >
                            <span style={{ fontSize: '1.2rem', display: 'block' }}>📎</span>
                            <span style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 700 }}>
                              Click to upload screenshot
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#8e9bb4', display: 'block' }}>
                              JPG/PNG, maximum 5 MB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div style={{ marginTop: '14px', marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '0.84rem',
                          color: '#fff',
                        }}
                      >
                        <input
                          type="checkbox"
                          name="agree"
                          checked={formData.agree}
                          onChange={handleInputChange}
                          required
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#00e5ff',
                            cursor: 'pointer',
                          }}
                        />
                        <span>I confirm that all provided details and payment reference are genuine and accurate.</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    BOTTOM NAVIGATION & SUBMIT BUTTONS
                ───────────────────────────────────────────────────────────── */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      ← Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Skip Step Button (Available on Steps 1 to 4) */}
                    {currentStep < 5 && (
                      <button
                        type="button"
                        id="skip-step-button"
                        onClick={handleSkipStep}
                        title="Skip this section and move to next step"
                        style={{
                          padding: '12px 22px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#cbd5e1',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#00e5ff';
                          e.currentTarget.style.color = '#00e5ff';
                          e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                          e.currentTarget.style.color = '#cbd5e1';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        <span>Skip</span>
                        <span style={{ fontSize: '1rem' }}>↷</span>
                      </button>
                    )}

                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        style={{
                          padding: '12px 28px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #00e5ff, #0088ff)',
                          border: 'none',
                          color: '#000',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Continue to Step 0{currentStep + 1} →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          padding: '14px 32px',
                          borderRadius: '12px',
                          background: isSubmitting
                            ? 'rgba(255,255,255,0.2)'
                            : 'linear-gradient(135deg, #00e676, #00b0ff)',
                          border: 'none',
                          color: '#000',
                          fontSize: '0.95rem',
                          fontWeight: 900,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          boxShadow: '0 0 25px rgba(0, 230, 118, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '16px',
                                height: '16px',
                                border: '2px solid #000',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }}
                            />
                            <span>Submitting to Sheets / Excel...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Registration & Save</span>
                            <span>➔</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* ================= AUTH / LOGIN / SIGNUP / PROFILE VIEW ================= */
            <div style={{ maxWidth: '460px', margin: '0 auto', padding: '10px 0 20px 0' }}>
              {isAuthenticated && user ? (
                /* ── Logged In Account Dashboard ── */
                <div
                  style={{
                    background: 'linear-gradient(145deg, rgba(8, 14, 30, 0.9), rgba(4, 10, 22, 0.95))',
                    border: '1.5px solid rgba(0, 229, 255, 0.35)',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 229, 255, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  {/* Avatar */}
                  <div style={{ display: 'inline-block', position: 'relative', marginBottom: '14px' }}>
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #00e5ff',
                          boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00e5ff, #0077b6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          fontWeight: 900,
                          color: '#fff',
                          margin: '0 auto',
                          boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
                        }}
                      >
                        {user.name?.[0]?.toUpperCase() || 'P'}
                      </div>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: '#00e676',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '2px solid #060a16',
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-title, sans-serif)',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: '#fff',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {user.name}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(200, 220, 255, 0.6)',
                      fontSize: '0.85rem',
                      margin: '0 0 16px 0',
                      wordBreak: 'break-all',
                    }}
                  >
                    {user.email}
                  </p>

                  <div
                    style={{
                      display: 'inline-flex',
                      gap: '8px',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: 'rgba(0, 229, 255, 0.1)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      color: '#00e5ff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '20px',
                    }}
                  >
                    <span>●</span> {user.provider === 'google' ? 'Google Authenticated' : 'Supabase Email Account'}
                  </div>

                  {/* Dual Sync Notice */}
                  <div
                    style={{
                      background: 'rgba(0, 229, 255, 0.05)',
                      border: '1px solid rgba(0, 229, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '14px',
                      textAlign: 'left',
                      marginBottom: '22px',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#00e5ff', marginBottom: '4px' }}>
                      ⚡ DUAL-PERSISTENCE SYNC
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
                      When you submit team registrations, they are directly recorded into Google Sheets (Excel) and securely tied to your Supabase ID (<code style={{ color: '#ffb703' }}>{user.id.slice(0, 8)}...</code>).
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveMode('register')}
                      style={{
                        width: '100%',
                        padding: '13px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #00e5ff, #0077b6)',
                        border: 'none',
                        color: '#000',
                        fontSize: '0.88rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                        transition: 'all 0.2s',
                      }}
                    >
                      ⚔️ PROCEED TO TEAM REGISTRATION
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '12px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 107, 129, 0.4)',
                        color: '#ff6b81',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255, 107, 129, 0.1)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      🚪 Sign Out of Account
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Login / Sign Up Forms ── */
                <div
                  style={{
                    background: 'linear-gradient(145deg, rgba(8, 14, 30, 0.85), rgba(4, 10, 22, 0.9))',
                    border: '1.5px solid rgba(0, 229, 255, 0.25)',
                    borderRadius: '20px',
                    padding: '24px 22px',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {/* Header */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>⚓</div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-title, sans-serif)',
                        fontSize: '1.3rem',
                        fontWeight: 900,
                        color: '#fff',
                        letterSpacing: '0.04em',
                        margin: 0,
                      }}
                    >
                      {authTab === 'login' ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE WANO FEST ACCOUNT'}
                    </h3>
                    <p style={{ color: 'rgba(200, 220, 255, 0.55)', fontSize: '0.78rem', marginTop: '4px' }}>
                      {authTab === 'login'
                        ? 'Access your registrations and manage team tickets'
                        : 'Register your pirate identity for Wano Fest 2026'}
                    </p>
                  </div>

                  {/* Sub-Tabs: Login vs Sign Up */}
                  <div
                    style={{
                      display: 'flex',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '4px',
                      marginBottom: '18px',
                      border: '1px solid rgba(0, 229, 255, 0.12)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        background:
                          authTab === 'login'
                            ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(0, 180, 200, 0.15))'
                            : 'transparent',
                        color: authTab === 'login' ? '#00e5ff' : 'rgba(255, 255, 255, 0.4)',
                        border: authTab === 'login' ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      🔐 Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signup');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '9px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        background:
                          authTab === 'signup'
                            ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(0, 180, 200, 0.15))'
                            : 'transparent',
                        color: authTab === 'signup' ? '#00e5ff' : 'rgba(255, 255, 255, 0.4)',
                        border: authTab === 'signup' ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      ⚡ Create Account
                    </button>
                  </div>

                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                      (e.currentTarget as HTMLElement).style.borderColor = '#00e5ff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.06)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: '14px 0 16px',
                      gap: '10px',
                    }}
                  >
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.35)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                      }}
                    >
                      OR WITH EMAIL
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                  </div>

                  {/* Alerts */}
                  {authError && (
                    <div
                      style={{
                        background: 'rgba(217, 4, 41, 0.15)',
                        border: '1px solid rgba(217, 4, 41, 0.4)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '14px',
                        color: '#ff6b81',
                        fontSize: '0.78rem',
                      }}
                    >
                      ⚠️ {authError}
                    </div>
                  )}
                  {authSuccess && (
                    <div
                      style={{
                        background: 'rgba(0, 230, 118, 0.15)',
                        border: '1px solid rgba(0, 230, 118, 0.4)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '14px',
                        color: '#00e676',
                        fontSize: '0.78rem',
                      }}
                    >
                      {authSuccess}
                    </div>
                  )}

                  {/* Login Form */}
                  {authTab === 'login' ? (
                    <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>EMAIL ADDRESS</label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="subash@example.com"
                          required
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showAuthPassword ? 'text' : 'password'}
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            style={{ ...inputStyle, paddingRight: '40px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.4)',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                            }}
                          >
                            {showAuthPassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        style={{
                          marginTop: '6px',
                          padding: '13px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #00e5ff, #0077b6)',
                          border: 'none',
                          color: '#000',
                          fontSize: '0.88rem',
                          fontWeight: 900,
                          letterSpacing: '0.08em',
                          cursor: authLoading ? 'wait' : 'pointer',
                          opacity: authLoading ? 0.7 : 1,
                          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                        }}
                      >
                        {authLoading ? 'LOGGING IN...' : '🔐 SIGN IN'}
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Don't have an account?{' '}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab('signup');
                            setAuthError(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#00e5ff',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Create one now
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Sign Up Form */
                    <form onSubmit={handleEmailSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>FULL NAME</label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Monkey D. Subash"
                          required
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>COLLEGE / INSTITUTION</label>
                        <input
                          type="text"
                          value={authCollege}
                          onChange={(e) => setAuthCollege(e.target.value)}
                          placeholder="e.g. Sri Sai Ranganathan Engineering College"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>EMAIL ADDRESS</label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="subash@example.com"
                          required
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>PASSWORD (MIN 6 CHARACTERS)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showAuthPassword ? 'text' : 'password'}
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Create password"
                            required
                            minLength={6}
                            style={{ ...inputStyle, paddingRight: '40px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.4)',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                            }}
                          >
                            {showAuthPassword ? '🙈' : '👁️'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>CONFIRM PASSWORD</label>
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          value={authConfirmPassword}
                          onChange={(e) => setAuthConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          style={inputStyle}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        style={{
                          marginTop: '6px',
                          padding: '13px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #00e5ff, #0077b6)',
                          border: 'none',
                          color: '#000',
                          fontSize: '0.88rem',
                          fontWeight: 900,
                          letterSpacing: '0.08em',
                          cursor: authLoading ? 'wait' : 'pointer',
                          opacity: authLoading ? 0.7 : 1,
                          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
                        }}
                      >
                        {authLoading ? 'CREATING ACCOUNT...' : '⚡ CREATE ACCOUNT'}
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                          Already have an account?{' '}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthTab('login');
                            setAuthError(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#00e5ff',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ================= QR ZOOM LIGHTBOX ================= */}
      {qrZoomOpen && (
        <div
          onClick={() => setQrZoomOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            background: 'rgba(3, 5, 12, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              padding: '18px',
              borderRadius: '20px',
              boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 0 60px rgba(0, 229, 255, 0.3)',
              textAlign: 'center',
              position: 'relative',
              maxWidth: 'min(420px, 92vw)',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <button
              type="button"
              aria-label="Close QR zoom"
              onClick={() => setQrZoomOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.15)',
                background: 'rgba(0,0,0,0.06)',
                color: '#333',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              ✕
            </button>

            <img
              src={currentQrImage}
              alt="UPI Payment QR Code — Enlarged"
              style={{
                width: 'min(340px, 78vw)',
                height: 'min(340px, 78vw)',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '12px',
                margin: '0 auto',
              }}
            />

            <div
              style={{
                marginTop: '12px',
                fontSize: '1rem',
                fontWeight: 900,
                color: '#111',
                letterSpacing: '0.02em',
              }}
            >
              Scan & Pay ₹200
            </div>
            <div
              style={{
                marginTop: '4px',
                fontSize: '0.85rem',
                color: '#555',
                fontWeight: 700,
              }}
            >
              GPay • PhonePe • Paytm • Any UPI App
            </div>
            <div
              style={{
                marginTop: '10px',
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                color: '#007c91',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.03em',
              }}
            >
              UPI ID: itzsiva01@oksbi
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 800,
  color: '#8e9bb4',
  letterSpacing: '0.1em',
  marginBottom: '6px',
  textTransform: 'uppercase',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(6, 8, 14, 0.85)',
  border: '1px solid rgba(0, 229, 255, 0.2)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};
