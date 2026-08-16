function ImagePreview({ image, onReset, disabled = false }) {
  if (!image) return null

  return (
    <section className="preview-card" aria-labelledby="preview-title">
      <div className="section-heading"><span className="step-number">2</span><div><h2 id="preview-title">Review your image</h2><p>Confirm this is the photo you want to check.</p></div></div>
      <div className="preview-content">
        <img src={image.url} alt={`Selected image: ${image.file.name}`} />
        <div className="preview-meta"><strong title={image.file.name}>{image.file.name}</strong><span>{Math.ceil(image.file.size / 1024)} KB</span><button type="button" className="text-button" onClick={onReset} disabled={disabled}>Remove image</button></div>
      </div>
    </section>
  )
}

export default ImagePreview