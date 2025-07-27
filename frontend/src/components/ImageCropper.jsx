import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@mui/material';
import { getCroppedImg } from '../utils/cropImageUtils';

const ImageCropper = ({ image, onCancel, onCropDone }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleCrop = async () => {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels,);
        onCropDone(croppedImage);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <div className="relative w-[90%] h-[60vh] bg-white">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="mt-4 flex gap-4">
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, zoom) => setZoom(zoom)}
                />
                <button onClick={handleCrop} className="px-4 py-2 bg-green-600 text-white rounded">Crop</button>
                <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            </div>
        </div>
    );
};

export default ImageCropper;
