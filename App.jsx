import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [pickerRange, setPickerRange] = useState([thirtyDaysAgo, new Date()]);


  return (
    <>
      <AuthProvider>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-canvas-card focus:px-4 focus:py-2 focus:font-semibold focus:text-txt-main focus:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kiwi-primary'
        >
          Skip to main content
        </a>
        <div className='flex flex-col md:flex-row h-screen'>
          <Nav />
          <main id='main-content' tabIndex={-1} className='w-full flex-1 overflow-y-auto order-1 md:order-2 md:p-8 px-4 py-8 outline-none'>
            <Outlet context={[pickerRange, setPickerRange]} />
            <Toaster richColors closeButton position='top-right'/>
          </main>
        </div>

      </AuthProvider>
    </>
  );
}

export default App;
