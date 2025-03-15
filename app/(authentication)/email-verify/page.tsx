import { Metadata } from 'next';
import EmailVerifyForm from './_components/email-verification';

export const metadata: Metadata = {
  title: 'Email Verification',
  description: 'Email Verification',
};

const EmailVerificationPage = () => {
  return (
    <div className="w-full flex items-center justify-center h-full">
      <EmailVerifyForm />
    </div>
  );
};

export default EmailVerificationPage;
