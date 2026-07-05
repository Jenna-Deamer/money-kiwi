import { Outlet } from 'react-router-dom';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AuthProvider>
        <div className='flex flex-col md:flex-row h-screen'>
          <Nav />
          <main className='w-full flex-1 overflow-y-auto order-1 md:order-2 md:p-8 px-4 py-8 '>            <Outlet />
            <Toaster richColors position='bottom-right' expand={true} />
          </main>
        </div>

      </AuthProvider>
    </>
  );
}

export default App;
