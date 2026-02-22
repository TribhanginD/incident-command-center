import Dashboard from './pages/Dashboard'
import { Login } from './pages/Login'
import { useAuthStore } from './store'

function App() {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Login />;
    }

    return (
        <Dashboard />
    )
}

export default App
