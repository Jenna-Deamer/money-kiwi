import { Outlet } from 'react-router-dom';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';

function App() {
    return (
        <>

            <Toaster richColors position="bottom-right" expand={true} />
            <AuthProvider>
                <Nav />
                <main>
                    <Outlet />
                </main>
            </AuthProvider>
        </>
    );
}

export default App;
