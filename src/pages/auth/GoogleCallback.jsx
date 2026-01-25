import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function OAuthCallback() {
  usePageTitle('Authenticating...');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuth = async () => {
      const error = searchParams.get('error');
      const data = searchParams.get('data');

      if (error) {
        setError(decodeURIComponent(error));
        setTimeout(() => navigate('/buyer/login'), 3000);
      } else if (data) {
        try {
          const response = JSON.parse(atob(data));
          
          const userData = {
            userType: response.user_type,
            firstName: response.first_name,
            lastName: response.last_name,
            email: response.email,
            roles: response.roles,
            fullName: `${response.first_name} ${response.last_name}`,
          };
          
          localStorage.setItem('auth_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          dispatch(setCredentials({
            token: response.access_token,
            refresh_token: response.refresh_token,
            user: userData,
            rememberMe: false,
          }));
          
          const { initTokenRefresh } = await import('@/utils/tokenRefresh');
          initTokenRefresh();

          if (response.user_type === 'seller' && response.needs_profile) {
            navigate('/seller/complete-profile');
          } else {
            navigate('/');
          }
        } catch (err) {
          setError(`Failed to process authentication: ${err.message}`);
          setTimeout(() => navigate('/buyer/login'), 3000);
        }
      } else {
        setError('Invalid authentication response');
        setTimeout(() => navigate('/buyer/login'), 3000);
      }
    };
    
    handleOAuth();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-md w-full mx-4">
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
      </div>
    </div>
  );
}
