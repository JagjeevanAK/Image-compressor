import { useState } from 'react'
import './App.css'
import imageCompression from 'browser-image-compression'

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [compressionRatio, setCompressionRatio] = useState<number | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [compressionPercentage, setCompressionPercentage] = useState<number>(50)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? [...event.target.files] : []
    if (files.length === 0) return

    const originalFile = files[0]
    const originalImage = URL.createObjectURL(originalFile)
    setOriginalImage(originalImage)
    setOriginalFile(originalFile)
    setOriginalSize(originalFile.size)
  }

  const handleImageCompression = async () => {
    if (!originalFile) return

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: compressionPercentage / 100
    }

    try {
      const compressedFile = await imageCompression(originalFile, options)
      const compressedImage = await imageCompression.getDataUrlFromFile(compressedFile)
      setCompressedImage(compressedImage)
      setCompressedFile(compressedFile)
      const ratio = (originalFile.size - compressedFile.size) / originalFile.size * 100
      setCompressionRatio(ratio)
      setCompressedSize(compressedFile.size)
      console.log(`Original Size: ${originalFile.size}, Compressed Size: ${compressedFile.size}, Compression Ratio: ${ratio}%`)
    } catch (error) {
      console.error(error)
    }
  }

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click()
  }

  const handleBackButton = () => {
    setOriginalImage(null)
    setCompressedImage(null)
    setCompressionRatio(null)
    setCompressedFile(null)
    setCompressionPercentage(50)
    setOriginalFile(null)
    setOriginalSize(null)
    setCompressedSize(null)
  }

  return (
    <div className="app">
      <h1>Image Compressor</h1>
      <input 
        type="file" 
        accept="image/*,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.ico" 
        onChange={handleImageUpload} 
        style={{ display: 'none' }} 
        id="file-input"
      />
      {!originalImage && (
        <button onClick={triggerFileInput}>Select Image</button>
      )}
      <div className="image-container">
        {originalImage && (
          <div className="image-wrapper">
            <h2>Original Image</h2>
            <img src={originalImage} alt="Original" className="original-image" />
            {originalSize !== null && (
              <p>Original Size: {(originalSize / 1024).toFixed(2)} KB</p>
            )}
          </div>
        )}
        {compressedImage && (
          <div className="image-wrapper">
            <h2>Compressed Image</h2>
            <img src={compressedImage} alt="Compressed" className="compressed-image" />
            {compressedSize !== null && (
              <p>Compressed Size: {(compressedSize / 1024).toFixed(2)} KB</p>
            )}
          </div>
        )}
      </div>
      {originalImage && !compressedImage && (
        <button onClick={handleImageCompression}>Compress Image</button>
      )}
      {compressionRatio !== null && (
        <p>Compression Ratio: {compressionRatio.toFixed(2)}%</p>
      )}
      {compressedFile && (
        <div className="button-wrapper">
          <a href={URL.createObjectURL(compressedFile)} download="compressed_image">
            <button>Download Compressed Image</button>
          </a>
          <button onClick={handleBackButton}>Back</button>
        </div>
      )}
    </div>
  )
}

export default App
