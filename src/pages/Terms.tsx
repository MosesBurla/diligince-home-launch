import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Terms of Service
            </h1>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="lead">Effective Date: April 1, 2025</p>

              <p>
                Please read these Terms of Service ("Terms", "Terms of Service")
                carefully before using the Diligince.ai website and platform
                operated by Diligince.ai ("us", "we", "our").
              </p>

              <p>
                Your access to and use of the Service is conditioned on your
                acceptance of and compliance with these Terms. These Terms apply
                to all visitors, users and others who access or use the Service.
              </p>

              <p>
                By accessing or using the Service, you agree to be bound by
                these Terms. If you disagree with any part of the terms, then
                you may not access the Service.
              </p>

              {/* Accounts Section */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Accounts</h2>
              <p>
                When you create an account with us, you must provide us with
                accurate, complete and up-to-date information. Failure to do so
                constitutes a breach of the Terms, which may result in immediate
                termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use
                to access the Service and for any activities or actions under
                your password, whether your password is with our Service or a
                third-party service.
              </p>
              <p>
                You agree not to disclose your password to any third party. You
                must notify us immediately upon becoming aware of any breach of
                security or unauthorized use of your account.
              </p>

              {/* Subscriptions */}
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Subscriptions and Payments
              </h2>
              <p>
                Some parts of the Service are billed on a subscription basis.
                You will be billed in advance on a recurring and periodic basis,
                depending on the type of subscription plan you select.
              </p>
              <p>
                At the end of each billing period, your subscription will
                automatically renew under the same conditions unless you cancel
                it or we cancel it. You may cancel your subscription at any time
                through your account settings or by contacting our customer
                support team.
              </p>
              <p>
                For any subscription changes or cancellations, changes will take
                effect at the end of the current billing cycle. You will not
                receive a refund for the current billing cycle.
              </p>
              <p>
                We use trusted third-party payment processors for all
                transactions. By providing your payment information, you
                authorize us to charge your payment method for all subscription
                fees incurred.
              </p>

              {/* Restrictions */}
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Platform Usage and Restrictions
              </h2>
              <p>
                Our platform is designed to connect industrial plants with
                vendors, professionals and logistics providers. Users may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use the platform for any illegal purpose or to solicit others
                  to perform illegal acts
                </li>
                <li>
                  Violate any international, federal, provincial or state
                  regulations, rules, laws, or local ordinances
                </li>
                <li>
                  Infringe upon or violate our intellectual property rights or
                  the intellectual property rights of others
                </li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or any other type of code</li>
                <li>Collect or track the personal information of others</li>
                <li>
                  Interfere with or circumvent the security features of the
                  Service
                </li>
                <li>
                  Engage in unauthorized framing or linking to the Service
                </li>
              </ul>

              {/* IP */}
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Intellectual Property
              </h2>
              <p>
                The Service and its original content, features and functionality
                are and will remain the exclusive property of Diligince.ai and
                its licensors. The Service is protected by copyright, trademark
                and other laws of both India and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection
                with any product or service without the prior written consent of
                Diligince.ai.
              </p>

              {/* Termination */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service or contact us to request account
                deletion.
              </p>

              {/* Liability */}
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Limitation of Liability
              </h2>
              <p>
                In no event shall Diligince.ai, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or inability to access the Service</li>
                <li>
                  Any conduct or content of any third party on the Service
                </li>
                <li>Any content obtained from the Service</li>
                <li>
                  Unauthorized access, use or alteration of your transmissions
                  or content
                </li>
              </ul>

              {/* Changes */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days' notice prior to any new
                terms taking effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions
                become effective, you agree to be bound by the revised terms. If
                you do not agree to the new terms, please stop using the
                Service.
              </p>

              {/* Contact */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <p>
                Email:{" "}
                <a href="mailto:legal@Diligince.ai">legal@Diligince.ai</a>
                <br />
                Phone: +91 9848756956
                <br />
                Address: Visakhapatnam, Andhra Pradesh, India
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
