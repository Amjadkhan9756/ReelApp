
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ChooseRegister from '../pages/auth/ChooseRegister'
import UserRegister from '../pages/auth/UserRegister'
import VideoPartnerRegister from '../pages/auth/VideoPartnerRegister'
import UserLogin from '../pages/auth/UserLogin'
import VideoPartnerLogin from '../pages/auth/VideoPartnerLogin'
import ProtectedHome from '../pages/auth/ProtectedHome';
import Saved from '../pages/general/Saved';
import CreateVideo from '../pages/video-partner/CreateVideo';
import Profile from '../pages/video-partner/Profile';
import AuthGate from '../pages/auth/AuthGate';
import BottomNav from '../components/BottomNav';

function AppRoutes() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/register' element={<ChooseRegister />} />
                    <Route path='/user/register' element={<UserRegister />} />
                    <Route path='/video-partner/register' element={<VideoPartnerRegister />} />
                    <Route path='/' element={<AuthGate />} />
                    <Route path='/home' element={<ProtectedHome />} />
                    <Route path='/user/login' element={<UserLogin />} />
                    <Route path='/video-partner/login' element={<VideoPartnerLogin />} />
                    <Route path='/create-video' element={<CreateVideo />} />
                    <Route path='/video-partner/:id' element={<Profile />} />
                    <Route path="/saved" element={<Saved />} />
                </Routes>
                <BottomNav />
            </Router>
        </>
    )
}

export default AppRoutes;