import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../Style/profile.css";
import axios from 'axios';
import type { ApiMessageResponse, FoodItem, FoodPartnerProfile, FoodPartnerProfileResponse } from '../../types';
import { getApiErrorMessage } from '../../apiError';



const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState<FoodPartnerProfile | null>(null);
    const [videos, setVideos] = useState<FoodItem[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const videoRefs = useRef(new Map<string, HTMLVideoElement>());
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get<ApiMessageResponse>('/api/auth/user/logout', { withCredentials: true });
        } finally {
            navigate('/', { replace: true });
        }
    };

    useEffect(() => {
        if (!id) return;
        axios.get<FoodPartnerProfileResponse>(`/api/food-partner/${id}`, { withCredentials: true })
            .then(res => {
                setProfile(res.data.foodPartner)
                setVideos(res.data.foodPartner.foodItems)
            })
            .catch((error: unknown) => {
                setErrorMessage(getApiErrorMessage(error, 'Could not load this profile. Please try again.'));
            })
    }, [id])
//for playing videos in profile 
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (!(video instanceof HTMLVideoElement)) return;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            });
        }, { threshold: [0, 0.5, 1] });

        videoRefs.current.forEach((video) => observer.observe(video));
        return () => observer.disconnect();
    }, [videos]);

    const setVideoRef = (videoId: string) => (element: HTMLVideoElement | null) => {
        if (element) {
            videoRefs.current.set(videoId, element);
        } else {
            videoRefs.current.delete(videoId);
        }
    };

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total videos</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
                <button className="profile-logout" type="button" onClick={handleLogout}>Log out</button>
            </section>

            <hr className="profile-sep" />

            {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div key={v._id} className="profile-grid-item">
                        {v.mediaType?.startsWith('image/') ? (
                            <img className="profile-grid-video" src={v.video} alt={v.name || 'videos post'} />
                        ) : (
                            <video
                                ref={setVideoRef(v._id)}
                                className="profile-grid-video"
                                src={v.video}
                                muted
                                playsInline
                                loop
                                preload="metadata"
                                controls
                            />
                        )}
                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile;