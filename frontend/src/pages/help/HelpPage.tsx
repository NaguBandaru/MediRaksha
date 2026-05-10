import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  Clock,
  HelpCircle,
  FileText,
  Video
} from 'lucide-react';

export default function HelpPage() {
  const faqItems = [
    { q: 'How do I add a new medicine to inventory?', a: 'Go to Medicines → Click "Add Medicine" → Fill in details like name, batch, MRP, expiry date, and quantity.' },
    { q: 'How do I generate a GST invoice?', a: 'Navigate to Transactions → New Sale → Add items → The GST invoice is auto-generated with proper tax breakdowns.' },
    { q: 'How to set up low stock alerts?', a: 'Go to Tools → Notification Rules → Set minimum quantity thresholds for each medicine category.' },
    { q: 'How do I take a backup of my data?', a: 'Navigate to Backup → Click "Create Backup" → Your data will be securely saved to the cloud.' },
    { q: 'Can I manage multiple users?', a: 'Yes! Go to Users → Add new staff members with specific roles like Pharmacist, Cashier, or Admin.' },
  ];

  const guides = [
    { title: 'Getting Started Guide', desc: 'Learn the basics of MediRaksha ERP', icon: BookOpen },
    { title: 'Inventory Management', desc: 'Master stock tracking & batch management', icon: FileText },
    { title: 'Billing & Invoicing', desc: 'GST-compliant billing workflows', icon: Zap },
    { title: 'Video Tutorials', desc: 'Step-by-step visual walkthroughs', icon: Video },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Help & Support</h1>
          <p className="text-xs text-gray-500">Get help, read documentation, or contact our support team.</p>
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black uppercase flex items-center gap-2">
                <Phone size={20} />
                Contact Our Support
              </h3>
              <p className="text-primary-100 text-sm mt-1">Our team is available to help you with any issues or questions.</p>
            </div>
            <a 
              href="tel:7993035616"
              className="inline-flex items-center gap-3 bg-white text-primary-700 px-6 py-3 rounded-lg font-black text-lg hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone size={22} className="animate-pulse" />
              7993035616
            </a>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">Phone Support</h4>
              <a href="tel:7993035616" className="text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors">
                7993035616
              </a>
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                <Clock size={10} /> Available Mon–Sat, 9 AM – 9 PM
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
              <MessageCircle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">WhatsApp</h4>
              <a href="https://wa.me/917993035616" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors">
                7993035616
              </a>
              <p className="text-[10px] text-gray-500 mt-1">Quick responses via WhatsApp</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase">Email Support</h4>
              <p className="text-sm font-bold text-primary-600">support@mediraksha.in</p>
              <p className="text-[10px] text-gray-500 mt-1">We respond within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Guides & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Start Guides */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Quick Start Guides</h3>
            </div>
            <div className="p-2">
              {guides.map((guide) => (
                <button 
                  key={guide.title}
                  className="w-full flex items-center p-3 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-all group text-left"
                >
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 group-hover:text-primary-600 transition-colors">
                    <guide.icon size={20} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{guide.title}</p>
                    <p className="text-[10px] text-gray-500 leading-tight">{guide.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle size={14} />
                Frequently Asked Questions
              </h3>
            </div>
            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{faq.q}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={20} className="text-green-500" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">System Information</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Version</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">v1.0.0</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <p className="text-[10px] text-gray-500 uppercase font-bold">License</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">Active</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Backend</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">.NET 8</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Support</p>
              <p className="text-sm font-black text-green-600">Online</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
