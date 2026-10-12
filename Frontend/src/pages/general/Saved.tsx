import { useEffect, useState } from 'react'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import type { FoodItem, SavedFoodsResponse, ToggleSaveFoodResponse } from '../../types'
import { getApiErrorMessage } from '../../apiError'

const Saved = () => {
    const [ videos, setVideos ] = useState<FoodItem[]>([])
    const [ errorMessage, setErrorMessage ] = useState('')

    useEffect(() => {
        axios.get<SavedFoodsResponse>("/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                }))
                setVideos(savedFoods)
            })
            .catch((error: unknown) => {
                setErrorMessage(getApiErrorMessage(error, 'Could not load saved videos. Please try again.'));
            })
    }, [])

    const removeSaved = async (item: FoodItem) => {
        setErrorMessage('');
        try {
            await axios.post<ToggleSaveFoodResponse>("/api/food/save", { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
        } catch (error: unknown) {
            setErrorMessage(getApiErrorMessage(error, 'Could not remove this saved video. Please try again.'));
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
            errorMessage={errorMessage}
        />
    )
}

export default Saved
