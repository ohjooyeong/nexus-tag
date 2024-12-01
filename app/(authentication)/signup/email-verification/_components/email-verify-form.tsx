import { Button } from '@/components/ui/button';

const EmailVerifyForm = () => {
  return (
    <div className="flex-col flex justify-center items-center mt-8 p-20">
      <div className="w-96 flex flex-col">
        <h3 className="text-2xl font-semibold">Sent you an email!</h3>
        <div className="w-full h-11 flex items-center justify-center rounded-sm mt-8 bg-slate-300">
          <span className="text-lg font-semibold text-black">
            brb1111@naver.com
          </span>
        </div>
        <p className="mt-8 mb-4 text-sm text-gray-500">
          {`Please check your email and verify your account. If you don't see our
          email, check your spam folder.`}
        </p>
        <Button
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
            transition mt-4"
        >{`I've already verified`}</Button>
        <Button variant={'outline'} className="mt-4">{`Resend Email`}</Button>
      </div>
    </div>
  );
};

export default EmailVerifyForm;
