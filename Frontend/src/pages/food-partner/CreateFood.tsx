import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
// @ts-ignore
import '../../Style/create-food.css'
import { useNavigate } from 'react-router-dom';

const MAX_MEDIA_SIZE = 20 * 1024 * 1024;

const CreateFood = () => {
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ mediaFile, setMediaFile ] = useState<File | null>(null);
    const [ mediaURL, setMediaURL ] = useState('');
    const [ fileError, setFileError ] = useState('');
    const [ submitError, setSubmitError ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!mediaFile) {
            setMediaURL('');
            return;
        }
        const url = URL.createObjectURL(mediaFile);
        setMediaURL(url);
        return () => URL.revokeObjectURL(url);
    }, [ mediaFile ]);

    const isSupportedMedia = (file: File) => file.type.startsWith('video/') || file.type.startsWith('image/');

    const validateMediaFile = (file: File, action: 'select' | 'drop') => {
        if (!isSupportedMedia(file)) {
            setFileError(`Please ${action} an image or video file.`);
            return false;
        }
        if (file.size > MAX_MEDIA_SIZE) {
            setFileError('Files must be 20MB or smaller.');
            return false;
        }
        return true;
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[ 0 ];
        if (!file) { setMediaFile(null); setFileError(''); return; }
        if (!validateMediaFile(file, 'select')) { setMediaFile(null); return; }
        setFileError('');
        setMediaFile(file);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer?.files?.[ 0 ];
        if (!file) { return; }
        if (!validateMediaFile(file, 'drop')) { setMediaFile(null); return; }
        setFileError('');
        setMediaFile(file);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError('');
        if (!mediaFile) return;
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('media', mediaFile);

        try {
            await axios.post("/api/food", formData, { withCredentials: true });
            navigate("/home");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSubmitError(error.response?.data?.message || 'Could not publish this post.');
            } else {
                setSubmitError('Could not publish this post.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDisabled = useMemo(() => !name.trim() || !mediaFile || isSubmitting, [ name, mediaFile, isSubmitting ]);

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create videos</h1>
                    <p className="create-food-subtitle">Share a photo or video, give it a name, and add a description.</p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    <div className="field-group">
                        <label htmlFor="foodVideo"> Video</label>
                        <input
                            id="foodMedia"
                            ref={fileInputRef}
                            className="file-input-hidden"
                            type="file"
                            accept="image/*,video/*"
                            onChange={onFileChange}
                        />

                        <div
                            className="file-dropzone"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <div className="file-dropzone-inner">
                                <svg className="file-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M10.8 3.2a1 1 0 0 1 .4-.08h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v1.6h1.6a1 1 0 0 1 1 1v7.2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1h1.6V3.2a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .6.2z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" fill="currentColor" />
                                </svg>
                                <div className="file-dropzone-text">
                                    <strong>Tap to upload</strong> or drag and drop
                                </div>
                                <div className="file-hint">Images or videos • Up to 20MB</div>
                            </div>
                        </div>

                        {fileError && <p className="error-text" role="alert">{fileError}</p>}

                        {mediaFile && (
                            <div className="file-chip" aria-live="polite">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M9 12.75v-1.5c0-.62.67-1 1.2-.68l4.24 2.45c.53.3.53 1.05 0 1.35L10.2 16.82c-.53.31-1.2-.06-1.2-.68v-1.5" />
                                </svg>
                                <span className="file-chip-name">{mediaFile.name}</span>
                                <span className="file-chip-size">{(mediaFile.size / 1024 / 1024).toFixed(1)} MB</span>
                                <div className="file-chip-actions">
                                    <button type="button" className="btn-ghost" onClick={openFileDialog}>Change</button>
                                    <button type="button" className="btn-ghost danger" onClick={() => { setMediaFile(null); setFileError(''); }}>Remove</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {mediaURL && (
                        <div className="video-preview">
                            {mediaFile?.type.startsWith('image/') ? (
                                <img className="video-preview-el" src={mediaURL} alt="Post preview" />
                            ) : (
                                <video className="video-preview-el" src={mediaURL} controls playsInline preload="metadata" />
                            )}
                        </div>
                    )}

                    <div className="field-group">
                        <label htmlFor="foodName">Name</label>
                        <input
                            id="foodName"
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="foodDesc">Description</label>
                        <textarea
                            id="foodDesc"
                            rows={4}
                            placeholder="Write a short description: ingredients, taste, spice level, etc."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={isDisabled}>
                            {isSubmitting ? 'Publishing...' : 'Publish post'}
                        </button>
                    </div>
                    {submitError && <p className="error-text" role="alert">{submitError}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateFood;