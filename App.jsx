import { Outlet } from 'react-router-dom';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AuthProvider>
        <div className='flex'>
          <Nav />
          <main className='w-full' >
            <Outlet />
            <Toaster richColors position="bottom-right" expand={true} />
          </main>
        </div>

      </AuthProvider>
    </>
  );
}

export default App;
