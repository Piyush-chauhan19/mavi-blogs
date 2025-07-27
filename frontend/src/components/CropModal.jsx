import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogActions, DialogContent, Button, Slider } from '@mui/material';
import { getCroppedImg } from '../utils/cropImageUtils';

const CropModal = ({ imageSrc, onClose, onCropComplete,  aspectRatio}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, aspectRatio);
    onCropComplete(croppedImage);
    onClose();
  };

  return (
    <Dialog open={!!imageSrc} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <div className="crop-container" style={{ position: 'relative', height: 400 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDone}>Crop</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropModal;
