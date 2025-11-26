import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Murranno Music's services, you accept and agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
            <p className="text-muted-foreground">
              You must create an account to use our services. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Music Distribution</h2>
            <p className="text-muted-foreground">
              We distribute your music to major streaming platforms and digital stores. You retain all
              ownership rights to your content. We only receive distribution rights necessary to
              provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="text-muted-foreground">
              Earnings are calculated based on streams and sales reported by streaming platforms.
              Payments are processed monthly with a minimum payout threshold of ₦5,000. Payment
              processing may take 3-5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Content Requirements</h2>
            <p className="text-muted-foreground">
              All uploaded content must be original or properly licensed. You warrant that you have
              all necessary rights to distribute the content. Content must not violate any laws or
              third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
            <p className="text-muted-foreground">
              You may not use our services to upload infringing content, engage in fraudulent activities,
              manipulate streaming numbers, or violate any applicable laws. Violations may result in
              account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Service Fees</h2>
            <p className="text-muted-foreground">
              We charge a platform fee as specified in your subscription plan. Additional services
              such as promotional campaigns have separate fees clearly displayed at purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="text-muted-foreground">
              Either party may terminate this agreement at any time. Upon termination, your content
              will be removed from distribution within 30 days. Outstanding payments will be processed
              according to normal schedules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Murranno Music is not liable for any indirect, incidental, or consequential damages
              arising from your use of our services. Our total liability is limited to the amount
              paid by you in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these terms at any time. Continued use of our services after changes
              constitutes acceptance of the new terms. We will notify you of significant changes
              via email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by Nigerian law. Any disputes will be resolved in Nigerian
              courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these terms, contact us at legal@murrannomusic.com
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </PageContainer>
  );
};
