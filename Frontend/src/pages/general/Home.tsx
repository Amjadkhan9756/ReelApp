import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReelFeed from "../../components/ReelFeed";
import "../../Style/reels.css";
import type { FoodItem, FoodItemsResponse, LikeFoodResponse, ToggleSaveFoodResponse } from "../../types";
import { getApiErrorMessage } from "../../apiError";

const Home = () => {
    const [videos, setVideos] = useState<FoodItem[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    // Prevents double-clicks / overlapping requests for the same video
    const pending = useRef(new Set<string>());

    useEffect(() => {
        axios.get<FoodItemsResponse>("/api/food", { withCredentials: true })
            .then((res) => setVideos(res.data.foodItems))
            .catch((error: unknown) => {
                console.error("Load error:", error);
                setErrorMessage(getApiErrorMessage(error, "Could not load videos. Please try again."));
            });
    }, []);

    const patchVideo = (id: string, patch: Partial<FoodItem>) =>
        setVideos((prev) => prev.map((v) => (v._id === id ? { ...v, ...patch } : v)));

    async function likeVideo(item: FoodItem) {
        const key = `like:${item._id}`;
        if (pending.current.has(key)) return;   // ignore clicks while request is running
        pending.current.add(key);
        const shouldLike = !(item.liked ?? false);
        const prevCount = item.likeCount ?? item.likesCount ?? item.likes ?? 0;
        const nextCount = Math.max(0, prevCount + (shouldLike ? 1 : -1));
        setErrorMessage("");

        patchVideo(item._id, {
            liked: shouldLike,
            likeCount: nextCount,
            likesCount: nextCount,
            likes: nextCount,
        });

        try {
            // We trust our own count; the server response is not used to overwrite it
            await axios.post<LikeFoodResponse>(
                "/api/food/like",
                { foodId: item._id, like: shouldLike },
                { withCredentials: true }
            );
        } catch (error: unknown) {
            console.error("Like error:", error);
            patchVideo(item._id, {
                liked: !shouldLike,
                likeCount: prevCount,
                likesCount: prevCount,
                likes: prevCount,
            });
            setErrorMessage(getApiErrorMessage(error, "Could not update the like. Please try again."));
        } finally {
            pending.current.delete(key);
        }
    }

    async function saveVideo(item: FoodItem) {
        const key = `save:${item._id}`;
        if (pending.current.has(key)) return;
        pending.current.add(key);

        const shouldSave = !(item.saved ?? false);
        const prevCount = item.savesCount ?? item.bookmarks ?? item.saves ?? 0;
        const nextCount = Math.max(0, prevCount + (shouldSave ? 1 : -1));
        setErrorMessage("");

        patchVideo(item._id, {
            saved: shouldSave,
            savesCount: nextCount,
            bookmarks: nextCount,
            saves: nextCount,
        });

        try {
            await axios.post<ToggleSaveFoodResponse>(
                "/api/food/save",
                { foodId: item._id, save: shouldSave },
                { withCredentials: true }
            );
        } catch (error: unknown) {
            console.error("Save error:", error);
            patchVideo(item._id, {
                saved: !shouldSave,
                savesCount: prevCount,
                bookmarks: prevCount,
                saves: prevCount,
            });
            setErrorMessage(getApiErrorMessage(error, "Could not update the saved status. Please try again."));
        } finally {
            pending.current.delete(key);
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
            errorMessage={errorMessage}
        />
    );
};

export default Home;