
import './App.css'


import { RouterProvider } from 'react-router-dom'

import { routers } from './BussinessLogic/Routes/routes'
import { AuthProvider, useAuth } from './BussinessLogic/Security/Auth.Context'
import { ThemeProvider } from './Theme/Theme.Context';
import { StorageProvider } from './BussinessLogic/Storage/Storage.Provider';
import { useEffect, useRef } from 'react';
import { setToastRef } from './Helpers/Toast.Helper';
import { Toast } from 'primereact/toast';
import NotificationListener from './Helpers/Notification.Listener';
import { RefreshProvider } from './BussinessLogic/Hooks/UseRefreshContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PrimeReactProvider } from 'primereact/api';


function AppContent() {
  const { state, getUser } = useAuth();
  const user = state.user ?? getUser();
  const toastRef = useRef<Toast | null>(null);

  useEffect(() => {
    setToastRef(toastRef); // register the ref globally
  }, []);

  return (
    <>
      <Toast ref={toastRef} />

      {user && user.id && user.id > 0 ? (
        <>

          <NotificationListener />
          <StorageProvider userId={user.id}>
            <ThemeProvider>
              <RouterProvider router={routers} />
            </ThemeProvider>
          </StorageProvider>

        </>
      ) : (
        <RouterProvider router={routers} />
      )}
    </>

  );
}

function App() {
  return (
    <PrimeReactProvider>
      <GoogleOAuthProvider clientId='17596690508-o4p4oo0oc37okat839su8kqqkiie6fc7.apps.googleusercontent.com'>
        <RefreshProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </RefreshProvider>
      </GoogleOAuthProvider>
    </PrimeReactProvider>

  );
}


export default App;
