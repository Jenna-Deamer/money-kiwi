import { Outlet } from 'react-router-dom';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';

function App() {
    return (
        <>
            <AuthProvider>
                <Nav />
                <main>
            <Outlet />
            <Toaster richColors position="bottom-right" expand={true} />

                </main>
            </AuthProvider>
        </>
    );
}

export default App;
