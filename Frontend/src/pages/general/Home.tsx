import { useEffect, useState } from "react";
import axios from 'axios';
import ReelFeed from "../../components/ReelFeed";
import "../../Style/reels.css";
import type { FoodItem, FoodItemsResponse, LikeFoodResponse, ToggleSaveFoodResponse } from '../../types';
import { getApiErrorMessage } from '../../apiError';



const Home = () => {
    const [videos, setVideos] = useState<FoodItem[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get<FoodItemsResponse>("/api/food", { withCredentials: true })
            .then(res => {
                setVideos(res.data.foodItems)
            })
            .catch((error: unknown) => {
                setErrorMessage(getApiErrorMessage(error, 'Could not load videos. Please try again.'));
            })
    }, [])

    async function likeVideo(item: FoodItem) {
        setErrorMessage('');
        try {
            const response = await axios.post<LikeFoodResponse>("/api/food/like", { foodId: item._id }, { withCredentials: true })
            if (response.data.like) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: (v.likeCount ?? 0) + 1 } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: Math.max(0, (v.likeCount ?? 0) - 1) } : v))
            }
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Could not update the like. Please try again.'));
        }
    }


    async function saveVideo(item: FoodItem) {
        setErrorMessage('');
        try {
            const response = await axios.post<ToggleSaveFoodResponse>("/api/food/save", { foodId: item._id }, { withCredentials: true })
            if (response.data.save) {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: (v.savesCount ?? 0) + 1 } : v))
            } else {
                setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 0) - 1) } : v))
            }
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Could not update the saved status. Please try again.'));
        }
    }
    return (
        <>
            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage="No videos available."
                errorMessage={errorMessage}
            />        </>
    )
}
export default Home;
