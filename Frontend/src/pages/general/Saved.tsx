import { useEffect, useState } from 'react'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import type { VideoItem, SavedVideosResponse, ToggleSaveVideoResponse } from '../../types'
import { getApiErrorMessage } from '../../apiError'

const Saved = () => {
    const [ videos, setVideos ] = useState<VideoItem[]>([])
    const [ errorMessage, setErrorMessage ] = useState('')

    useEffect(() => {
        axios.get<SavedVideosResponse>("/api/video/save", { withCredentials: true })
            .then(response => {
                const savedVideos = response.data.savedVideos.map((item) => ({
                    _id: item.video._id,
                    video: item.video.video,
                    description: item.video.description,
                    likeCount: item.video.likeCount,
                    savesCount: item.video.savesCount,
                    commentsCount: item.video.commentsCount,
                    videoPartner: item.video.videoPartner,
                }))
                setVideos(savedVideos)
            })
            .catch((error: unknown) => {
                setErrorMessage(getApiErrorMessage(error, 'Could not load saved videos. Please try again.'));
            })
    }, [])

    const removeSaved = async (item: VideoItem) => {
        setErrorMessage('');
        try {
            await axios.post<ToggleSaveVideoResponse>("/api/video/save", { videoId: item._id, save: false }, { withCredentials: true })
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
