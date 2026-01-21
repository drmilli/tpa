import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/logo.png" alt="The Peoples Affairs" className="h-10 w-10 mb-4" />
            <p className="text-sm">
              Transparent political intelligence for informed Nigerian citizens.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/politicians" className="hover:text-primary-400">Politicians</Link></li>
              <li><Link to="/rankings" className="hover:text-primary-400">Rankings</Link></li>
              <li><Link to="/polls" className="hover:text-primary-400">Polls</Link></li>
              <li><Link to="/blogs" className="hover:text-primary-400">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary-400">About Us</Link></li>
              <li><Link to="/methodology" className="hover:text-primary-400">Methodology</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Business</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact?type=advertising" className="hover:text-primary-400">Advertise with Us</Link></li>
              <li><Link to="/contact?type=partnership" className="hover:text-primary-400">Partnerships</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} The Peoples Affairs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
