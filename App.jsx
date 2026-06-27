import { Outlet } from 'react-router-dom';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AuthProvider>
        <div className="flex flex-col md:flex-row min-h-screen">
          <Nav />
          <main className="w-full flex-1 order-1 md:order-2 md:p-8 pb-16 max-w  max-w-6xl mx-auto">
            <Outlet />
            <Toaster richColors position="bottom-right" expand={true} />
          </main>
        </div>

      </AuthProvider>
    </>
  );
}

export default App;
