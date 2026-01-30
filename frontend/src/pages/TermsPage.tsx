import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600">Last updated: January 2024</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm">
            <div className="prose prose-gray max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using The Peoples Affairs (TPA) platform, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. If you do not agree with any
                of these terms, you are prohibited from using or accessing this site.
              </p>

              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily access the materials (information or software) on
                TPA's website for personal, non-commercial transitory viewing only. This is the grant
                of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>

              <h2>3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current
                information at all times. Failure to do so constitutes a breach of the Terms, which
                may result in immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service
                and for any activities or actions under your password.
              </p>

              <h2>4. Content and Conduct</h2>
              <p>
                Our platform allows users to participate in polls, comment on articles, and engage
                with content. When using these features, you agree to:
              </p>
              <ul>
                <li>Not post content that is defamatory, obscene, or unlawful</li>
                <li>Not impersonate others or misrepresent your affiliation</li>
                <li>Not engage in harassment or hate speech</li>
                <li>Not spread misinformation or fake news</li>
                <li>Respect the intellectual property rights of others</li>
              </ul>

              <h2>5. Political Content Disclaimer</h2>
              <p>
                TPA provides political information, rankings, and analysis based on publicly available
                data and our proprietary algorithms. While we strive for accuracy and objectivity:
              </p>
              <ul>
                <li>Rankings and scores are based on available data and may not capture all aspects of performance</li>
                <li>Our analysis should not be considered official government data</li>
                <li>We encourage users to verify information from multiple sources</li>
                <li>Political opinions expressed in user comments do not represent TPA's views</li>
              </ul>

              <h2>6. Accuracy of Information</h2>
              <p>
                The materials appearing on TPA's website could include technical, typographical, or
                photographic errors. TPA does not warrant that any of the materials on its website
                are accurate, complete, or current. TPA may make changes to the materials contained
                on its website at any time without notice.
              </p>

              <h2>7. Advertising</h2>
              <p>
                TPA may display advertisements on the platform. By using our service, you agree that:
              </p>
              <ul>
                <li>Advertisements are clearly marked as such</li>
                <li>Political advertisements comply with Nigerian electoral laws</li>
                <li>TPA is not responsible for the content of third-party advertisements</li>
              </ul>

              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall TPA or its suppliers be liable for any damages arising out of the
                use or inability to use the materials on TPA's website, even if TPA or a TPA authorized
                representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2>9. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws
                of the Federal Republic of Nigeria, and you irrevocably submit to the exclusive
                jurisdiction of the courts in that location.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                TPA reserves the right to revise these terms of service at any time without notice.
                By using this website, you are agreeing to be bound by the then-current version of
                these terms of service.
              </p>

              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul>
                <li>Email: legal@thepeoplesaffairs.com</li>
                <li>Address: Lagos, Nigeria</li>
              </ul>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/privacy"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Privacy Policy
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
