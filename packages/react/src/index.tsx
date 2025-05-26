export { UserDropdown } from './components/UserDropdown';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// import {} from "./Pages"

function AuthLayout() {
  return (
    <div className="sse-auth">
      <Outlet />
    </div>
  );
}

export function Routers() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}></Route>
    </Routes>
  );
}
