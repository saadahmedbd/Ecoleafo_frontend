import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const handleOAuth = async () => {
      const error = searchParams.get('error');
      const data = searchParams.get('data');

      // Capture debug info
      setDebugInfo({
        hasError: !!error,
        hasData: !!data,
        errorMessage: error ? decodeURIComponent(error) : null,
        dataLength: data ? data.length : 0,
        fullUrl: window.location.href,
        allParams: Object.fromEntries(searchParams.entries()),
      });

      // Debug: Log what we received
      console.log('OAuth Callback - Error:', error);
      console.log('OAuth Callback - Data:', data);
      console.log('OAuth Callback - Full URL:', window.location.href);

      if (error) {
        console.log('OAuth Error Detected:', decodeURIComponent(error));
        setError(decodeURIComponent(error));
        setTimeout(() => {
          navigate('/buyer/login');
        }, 3000);
      } else if (data) {
        try {
          console.log('Attempting to decode data...');
          const response = JSON.parse(atob(data));
          console.log('Decoded OAuth Response:', response);
          
          const userData = {
            userType: response.user_type,
            firstName: response.first_name,
            lastName: response.last_name,
            email: response.email,
            roles: response.roles,
            fullName: `${response.first_name} ${response.last_name}`,
          };
          
          console.log('Storing tokens and user data...');
          localStorage.setItem('auth_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          console.log('Dispatching credentials to Redux...');
          dispatch(setCredentials({
            token: response.access_token,
            refresh_token: response.refresh_token,
            user: userData,
            rememberMe: false,
          }));
          
          console.log('Initializing token refresh...');
          const { initTokenRefresh } = await import('@/utils/tokenRefresh');
          initTokenRefresh();

          console.log('OAuth Success! Redirecting...');
          // Check if user needs to complete profile
          if (response.user_type === 'seller' && response.needs_profile) {
            navigate('/seller/complete-profile');
          } else if (response.is_new_user) {
            navigate('/');
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('OAuth Processing Error:', err);
          console.error('Error Stack:', err.stack);
          setError(`Failed to process authentication: ${err.message}`);
          setTimeout(() => {
            navigate('/buyer/login');
          }, 3000);
        }
      } else {
        console.log('No error or data parameter found');
        setError('Invalid authentication response');
        setTimeout(() => {
          navigate('/buyer/login');
        }, 3000);
      }
    };
    
    handleOAuth();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="max-w-2xl w-full space-y-4">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
              <p className="text-gray-600">Please wait while we set up your account...</p>
            </>
          )}
        </div>

        {/* Debug Panel */}
        {debugInfo && (
          <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-700 p-6 text-left">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Debug Information
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 min-w-[120px]">Has Error:</span>
                <span className={debugInfo.hasError ? 'text-red-400' : 'text-green-400'}>
                  {debugInfo.hasError ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 min-w-[120px]">Has Data:</span>
                <span className={debugInfo.hasData ? 'text-green-400' : 'text-red-400'}>
                  {debugInfo.hasData ? 'YES' : 'NO'}
                </span>
              </div>
              {debugInfo.errorMessage && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 min-w-[120px]">Error Message:</span>
                  <span className="text-red-400 break-all">{debugInfo.errorMessage}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="text-gray-400 min-w-[120px]">Data Length:</span>
                <span className="text-blue-400">{debugInfo.dataLength}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 min-w-[120px]">All Params:</span>
                <span className="text-yellow-400 break-all">
                  {JSON.stringify(debugInfo.allParams, null, 2)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 min-w-[120px]">Full URL:</span>
                <span className="text-purple-400 break-all text-xs">{debugInfo.fullUrl}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <p className="text-yellow-400 text-xs">
                📋 Check browser console for detailed logs. Share this info with backend team if issue persists.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}