export default function Footer() {
  return (
    <footer className="py-12 bg-slate-900 text-slate-200 bottom-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Uni Hub</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Tutorials
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-white flex items-center justify-center text-primary font-bold">
              U
            </div>
            <span className="text-xl font-bold">Uni Hub</span>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Uni Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
