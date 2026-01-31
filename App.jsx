import { Outlet } from 'react-router-dom';
import Nav from './src/components/shared/Nav';
import { AuthProvider } from './src/context/AuthContext';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Toaster richColors position="bottom-right" expand={true} />
                <AuthProvider>
                    <Nav />
                    <main>
                        <Outlet />
                    </main>
                </AuthProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
