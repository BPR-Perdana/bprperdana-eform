import { useState } from 'react';
import OTPVerification from './OTPVerification';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DualOTPVerificationProps {
  appId: string;
  phone: string;
  email: string;
  onComplete: () => void;
}

export default function DualOTPVerification({ appId, phone, email, onComplete }: DualOTPVerificationProps) {
  const [smsVerified, setSmsVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Jika belum ada email di data, anggap terverifikasi (meski aturan bisnis mengharuskan)
  const isEmailRequired = !!email;

  const allVerified = smsVerified && (!isEmailRequired || emailVerified);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SMS OTP */}
        <Card className="p-6 relative overflow-hidden">
          {smsVerified && (
            <div className="absolute top-0 right-0 p-4">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          )}
          <OTPVerification
            appId={appId}
            method="sms"
            contactInfo={phone}
            onVerified={() => setSmsVerified(true)}
          />
        </Card>

        {/* Email OTP */}
        {isEmailRequired && (
          <Card className="p-6 relative overflow-hidden">
            {emailVerified && (
              <div className="absolute top-0 right-0 p-4">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            )}
            <OTPVerification
              appId={appId}
              method="email"
              contactInfo={email}
              onVerified={() => setEmailVerified(true)}
            />
          </Card>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={onComplete}
          disabled={!allVerified}
          className="w-full md:w-auto min-w-[200px]"
        >
          Lanjutkan
        </Button>
      </div>
    </div>
  );
}
