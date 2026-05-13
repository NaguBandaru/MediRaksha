import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/auth/authService';
import { Pill, User, Lock, Mail, Phone, Store, FileText, MapPin, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Login State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email: userId, password });
      const { data } = response;
      
      setAuth(
        {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          roles: data.roles
        },
        data.accessToken,
        data.refreshToken
      );
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        email,
        phoneNumber: mobile,
        password: signupPassword,
        shopName,
        gstNumber,
        shopAddress,
        licenceNumber
      };
      
      const response = await authService.register(payload);
      
      if (response.success) {
         toast.success('Registration successful! Please log in.');
         setIsLoginMode(true);
         setUserId(email);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b flex justify-between items-center px-8 py-3 z-20">
        <div className="flex items-center space-x-2">
          <Pill size={28} strokeWidth={2.5} className="text-[#27ae60]" />
          <h1 className="text-2xl font-black italic tracking-tighter leading-none">
            <span className="text-[#0b2046]">Medi</span><span className="text-[#27ae60]">Raksha</span>
          </h1>
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-semibold text-gray-600">
          <a href="#" className="hover:text-[#27ae60]">24x7 Support</a>
          <a href="#" className="hover:text-[#27ae60]">Downloads</a>
          <a href="#" className="hover:text-[#27ae60]">Prices</a>
          <a href="#" className="hover:text-[#27ae60]">Contact Us</a>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row bg-[#0b2046] relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b2046] via-[#122e5a] to-[#1a365d] z-0"></div>
        {/* Decorative Wave/Circle */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[140%] rounded-full bg-[#122e5a] opacity-50 z-0 blur-3xl"></div>

        {/* Left Side: Text and Marketing */}
        <div className="flex-1 z-10 flex flex-col justify-center px-12 md:px-24 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
            ERP Software Solutions: <span className="text-[#f1c40f]">Unlock the Full Potential</span> of Your Business
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl leading-relaxed">
            Transform your pharmacy business with our comprehensive ERP software solution. Streamline your operations with our smart inventory management, accounting, and GST compliance, allowing you to easily generate invoices, manage your accounts, and track inventory accurately with ease.
          </p>
          <div>
            <button className="bg-[#f1c40f] hover:bg-[#f39c12] text-[#0b2046] font-bold py-2.5 px-6 rounded text-sm transition duration-300 shadow-lg">
              Download Free Version
            </button>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="w-full md:w-[450px] lg:w-[500px] z-10 flex items-center justify-center p-4 md:p-8 bg-transparent">
          <div className="bg-white rounded-xl shadow-2xl w-full p-6 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#27ae60]"></div>
            
            <h3 className="text-xl font-bold text-[#0b2046] mb-5 text-center">
              {isLoginMode ? 'Login with your MediRaksha Credentials' : 'Create your MediRaksha Account'}
            </h3>

            {error && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded mb-4 text-xs border border-red-200">
                {error}
              </div>
            )}

            {isLoginMode ? (
              // LOGIN FORM
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="User ID (Email)"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#27ae60] focus:ring-1 focus:ring-[#27ae60]"
                      value={userId}
                      onChange={e => setUserId(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#27ae60] focus:ring-1 focus:ring-[#27ae60]"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-[#0b2046] hover:underline">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0b2046] hover:bg-[#1a365d] text-white font-bold py-2.5 rounded text-sm transition duration-200 mt-2"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
                <div className="text-center mt-5 text-xs text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setIsLoginMode(false); setError(''); }}
                    className="text-[#27ae60] font-bold hover:underline"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              // SIGNUP FORM
              <form onSubmit={handleSignupSubmit} className="flex flex-col h-full">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><User size={14} /></div>
                    <input type="text" required placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><Phone size={14} /></div>
                    <input type="tel" required placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><Mail size={14} /></div>
                    <input type="email" required placeholder="Email Id" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><Lock size={14} /></div>
                    <input type="password" required placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative col-span-2 md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><Store size={14} /></div>
                    <input type="text" required placeholder="Shop/Store Name" value={shopName} onChange={e => setShopName(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative col-span-2 md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><FileText size={14} /></div>
                    <input type="text" required placeholder="GST Number" value={gstNumber} onChange={e => setGstNumber(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"><ShieldCheck size={14} /></div>
                    <input type="text" required placeholder="Licence Number" value={licenceNumber} onChange={e => setLicenceNumber(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none" />
                  </div>
                  <div className="relative col-span-2">
                    <div className="absolute top-2.5 left-0 pl-2.5 pointer-events-none text-gray-400"><MapPin size={14} /></div>
                    <textarea required placeholder="Shop Address" value={shopAddress} onChange={e => setShopAddress(e.target.value)} className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded text-xs focus:border-[#27ae60] focus:outline-none min-h-[50px]" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#27ae60] hover:bg-[#2ecc71] text-white font-bold py-2.5 rounded text-sm transition duration-200 mt-auto"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
                <div className="text-center mt-3 text-xs text-gray-600 pb-1">
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setIsLoginMode(true); setError(''); }}
                    className="text-[#0b2046] font-bold hover:underline"
                  >
                    Log in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
