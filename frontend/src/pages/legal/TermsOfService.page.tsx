import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Link } from "react-router-dom";
import Layout from "@/components/core/Layout.tsx";
import PageHeader from "@/components/core/PageHeader.tsx";

export default function TermsOfServicePage() {
  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Terms of Service"
          description="The terms and services for using the Uni Hub website."
        />

        <Card className="p-6 mb-8">
          <div className="prose max-w-none">
            <p className="text-sm text-slate-500 mb-4">
              Last Updated: April 22, 2025
            </p>

            <div className="bg-slate-50 p-4 rounded-lg mb-8">
              <h3 className="font-medium text-slate-900 mb-2">
                Table of Contents
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-slate-700">
                <li>
                  <a href="#acceptance" className="hover:text-blue-600">
                    Acceptance of Terms
                  </a>
                </li>
                <li>
                  <a href="#changes" className="hover:text-blue-600">
                    Changes to Terms
                  </a>
                </li>
                <li>
                  <a href="#accounts" className="hover:text-blue-600">
                    User Accounts
                  </a>
                </li>
                <li>
                  <a href="#content" className="hover:text-blue-600">
                    User Content
                  </a>
                </li>
                <li>
                  <a href="#conduct" className="hover:text-blue-600">
                    Prohibited Conduct
                  </a>
                </li>
                <li>
                  <a href="#intellectual" className="hover:text-blue-600">
                    Intellectual Property
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-blue-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#termination" className="hover:text-blue-600">
                    Termination
                  </a>
                </li>
                <li>
                  <a href="#disclaimer" className="hover:text-blue-600">
                    Disclaimer of Warranties
                  </a>
                </li>
                <li>
                  <a href="#limitation" className="hover:text-blue-600">
                    Limitation of Liability
                  </a>
                </li>
                <li>
                  <a href="#governing" className="hover:text-blue-600">
                    Governing Law
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-blue-600">
                    Contact Information
                  </a>
                </li>
              </ol>
            </div>

            <section id="acceptance">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing or using the University Hub platform ("Service"),
                you agree to be bound by these Terms of Service ("Terms"). If
                you disagree with any part of the terms, you may not access the
                Service.
              </p>
              <p className="mb-4">
                These Terms apply to all visitors, users, and others who access
                or use the Service. By accessing or using the Service you agree
                to be bound by these Terms. If you are using the Service on
                behalf of an organization or entity, you represent and warrant
                that you are authorized to accept these Terms on their behalf.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                2. Changes to Terms
              </h2>
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days' notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion.
              </p>
              <p className="mb-4">
                By continuing to access or use our Service after those revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, please stop using the
                Service.
              </p>
            </section>

            <section id="accounts">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                3. User Accounts
              </h2>
              <p className="mb-4">
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account on our Service.
              </p>
              <p className="mb-4">
                You are responsible for safeguarding the password that you use
                to access the Service and for any activities or actions under
                your password, whether your password is with our Service or a
                third-party service.
              </p>
              <p className="mb-4">
                You agree not to disclose your password to any third party. You
                must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>
            </section>

            <section id="content">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                4. User Content
              </h2>
              <p className="mb-4">
                Our Service allows you to post, link, store, share and otherwise
                make available certain information, text, graphics, videos, or
                other material ("Content"). You are responsible for the Content
                that you post on or through the Service, including its legality,
                reliability, and appropriateness.
              </p>
              <p className="mb-4">
                By posting Content on or through the Service, you represent and
                warrant that: (i) the Content is yours (you own it) or you have
                the right to use it and grant us the rights and license as
                provided in these Terms, and (ii) the posting of your Content on
                or through the Service does not violate the privacy rights,
                publicity rights, copyrights, contract rights or any other
                rights of any person.
              </p>
              <p className="mb-4">
                We reserve the right to terminate the account of anyone found to
                be infringing on a copyright or other intellectual property
                rights.
              </p>
            </section>

            <section id="conduct">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                5. Prohibited Conduct
              </h2>
              <p className="mb-4">You agree not to use the Service:</p>
              <ul className="list-disc list-inside mb-4 space-y-2 pl-4">
                <li>
                  In any way that violates any applicable national or
                  international law or regulation.
                </li>
                <li>
                  For the purpose of exploiting, harming, or attempting to
                  exploit or harm minors in any way.
                </li>
                <li>
                  To transmit, or procure the sending of, any advertising or
                  promotional material, including any "junk mail", "chain
                  letter," "spam," or any other similar solicitation.
                </li>
                <li>
                  To impersonate or attempt to impersonate the University, a
                  University employee, another user, or any other person or
                  entity.
                </li>
                <li>
                  In any way that infringes upon the rights of others, or in any
                  way is illegal, threatening, fraudulent, or harmful.
                </li>
                <li>
                  To engage in any other conduct that restricts or inhibits
                  anyone's use or enjoyment of the Service, or which may harm
                  the University or users of the Service.
                </li>
              </ul>
            </section>

            <section id="intellectual">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                6. Intellectual Property
              </h2>
              <p className="mb-4">
                The Service and its original content (excluding Content provided
                by users), features, and functionality are and will remain the
                exclusive property of the University and its licensors. The
                Service is protected by copyright, trademark, and other laws of
                both the United States and foreign countries. Our trademarks and
                trade dress may not be used in connection with any product or
                service without the prior written consent of the University.
              </p>
            </section>

            <section id="privacy">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                7. Privacy
              </h2>
              <p className="mb-4">
                Your use of the Service is also governed by our Privacy Policy,
                which is incorporated into these Terms by reference. Please
                review our Privacy Policy for information on how we collect, use
                and share your information.
              </p>
            </section>

            <section id="termination">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                8. Termination
              </h2>
              <p className="mb-4">
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p className="mb-4">
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service or contact us to request account
                deletion.
              </p>
            </section>

            <section id="disclaimer">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                9. Disclaimer of Warranties
              </h2>
              <p className="mb-4">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
                The Service is provided without warranties of any kind, whether
                express or implied, including, but not limited to, implied
                warranties of merchantability, fitness for a particular purpose,
                non-infringement or course of performance.
              </p>
              <p className="mb-4">
                The University, its subsidiaries, affiliates, and its licensors
                do not warrant that a) the Service will function uninterrupted,
                secure or available at any particular time or location; b) any
                errors or defects will be corrected; c) the Service is free of
                viruses or other harmful components; or d) the results of using
                the Service will meet your requirements.
              </p>
            </section>

            <section id="limitation">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                10. Limitation of Liability
              </h2>
              <p className="mb-4">
                In no event shall the University, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from (i)
                your access to or use of or inability to access or use the
                Service; (ii) any conduct or content of any third party on the
                Service; (iii) any content obtained from the Service; and (iv)
                unauthorized access, use or alteration of your transmissions or
                content, whether based on warranty, contract, tort (including
                negligence) or any other legal theory, whether or not we have
                been informed of the possibility of such damage.
              </p>
            </section>

            <section id="governing">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                11. Governing Law
              </h2>
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with
                the laws of the state in which the University is located,
                without regard to its conflict of law provisions.
              </p>
              <p className="mb-4">
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights. If any
                provision of these Terms is held to be invalid or unenforceable
                by a court, the remaining provisions of these Terms will remain
                in effect.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-xl font-semibold text-slate-900 mb-3 mt-8">
                12. Contact Information
              </h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="mb-1">
                  <strong>Uni Hub Legal Department</strong>
                </p>
                <p className="mb-1">...</p>
                <p className="mb-1">...</p>
                <p className="mb-1">Email: ...</p>
                <p>Phone: ...</p>
              </div>
            </section>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 mb-12">
          <Button variant="outline" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
    </Layout>
  );
}
