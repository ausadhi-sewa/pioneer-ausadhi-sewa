import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <main className="min-h-screen ">
      <section className="mx-auto w-full max-w-5xl px-4 py-10">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-neutral-900">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using Pioneer Aushadhi Sewa, you agree to be bound by these Terms. If you do
              not agree, please do not use the service.
            </p>
            <h3>2. Orders and Payments</h3>
            <ul>
              <li>All orders are subject to availability and verification.</li>
              <li>Pricing may change without prior notice.</li>
              <li>We may cancel orders suspected of fraud or policy violations.</li>
            </ul>
            <h3>3. Medical Disclaimer</h3>
            <p>
              Information on this site is for general purposes and is not a substitute for
              professional medical advice. Always consult a qualified healthcare professional.
            </p>
            <h3>4. Accounts</h3>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>Notify us immediately of any unauthorized use.</li>
            </ul>
            <h3>5. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, Pioneer Aushadhi Sewa is not liable for indirect,
              incidental, or consequential damages arising from your use of the service.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}


