import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">Last updated: January 2024</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm">
            <div className="prose prose-gray max-w-none">
              <h2>1. Introduction</h2>
              <p>
                The Peoples Affairs ("TPA", "we", "us", or "our") respects your privacy and is
                committed to protecting your personal data. This privacy policy explains how we
                collect, use, disclose, and safeguard your information when you visit our website
                and use our services.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide, including:</p>
              <ul>
                <li>Name and email address (when creating an account)</li>
                <li>Phone number (optional)</li>
                <li>Comments and feedback you submit</li>
                <li>Poll responses and voting history</li>
              </ul>

              <h3>2.2 Automatically Collected Information</h3>
              <p>When you access our website, we automatically collect:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Personalize your experience</li>
                <li>Conduct polls and gather public opinion</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Respond to inquiries and provide support</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>4. Data Sharing and Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our website</li>
                <li><strong>Analytics:</strong> Aggregated, anonymized data for research and analysis</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>

              <h2>5. Poll and Voting Data</h2>
              <p>
                When you participate in polls on our platform:
              </p>
              <ul>
                <li>Individual votes are kept confidential</li>
                <li>Only aggregated results are publicly displayed</li>
                <li>We may use demographic data (if provided) for analysis</li>
                <li>Poll participation may be tracked to prevent duplicate voting</li>
              </ul>

              <h2>6. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Authenticate users and prevent fraud</li>
                <li>Analyze site traffic and usage</li>
                <li>Deliver targeted advertisements</li>
              </ul>
              <p>
                You can control cookies through your browser settings. Note that disabling cookies
                may affect some features of our website.
              </p>

              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal data, including:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage practices</li>
              </ul>
              <p>
                However, no method of transmission over the Internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>

              <h2>8. Your Rights</h2>
              <p>Under applicable data protection laws, you have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@thepeoplesaffairs.com.
              </p>

              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not
                knowingly collect personal information from children. If you believe we have
                collected information from a child, please contact us immediately.
              </p>

              <h2>10. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for
                the privacy practices or content of these external sites. We encourage you to
                review the privacy policies of any third-party sites you visit.
              </p>

              <h2>11. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated"
                date. We encourage you to review this policy periodically.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our data practices, please
                contact us:
              </p>
              <ul>
                <li>Email: privacy@thepeoplesaffairs.com</li>
                <li>Address: Lagos, Nigeria</li>
              </ul>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/terms"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Terms of Service
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
