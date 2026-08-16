function DetectionResults({ status, detections }) {
  const isDetecting = status === 'detecting'

  return (
    <section className="results-panel" aria-labelledby="results-title" aria-live="polite" aria-busy={isDetecting}>
      <div className="section-heading"><span className="step-number">3</span><div><h2 id="results-title">Detection results</h2><p>Results appear here after the image is analysed.</p></div></div>
      {status === 'initial' && <div className="result-empty"><span aria-hidden="true">◌</span><h3>Ready when you are</h3><p>Add an image and select Detect Garbage to view the assessment.</p></div>}
      {status === 'image-selected' && <div className="result-empty"><span aria-hidden="true">✓</span><h3>Image ready</h3><p>Select Detect Garbage when you are ready to analyse it.</p></div>}
      {isDetecting && <div className="result-empty result-loading" role="status"><span className="spinner" aria-hidden="true" /><h3>Detecting garbage</h3><p>Analysing your image. This may take a moment.</p></div>}
      {status === 'no-detections' && <div className="result-empty"><span aria-hidden="true">✓</span><h3>No garbage detected</h3><p>Try another image if you would like to check a different area.</p></div>}
      {status === 'error' && <div className="result-error" role="alert"><h3>We couldn’t complete the detection</h3><p>Please check your connection, make sure the service is available, and try again.</p></div>}
      {status === 'success' && <div className="detection-list"><div className="detection-summary"><h3>{detections.length} {detections.length === 1 ? 'Object' : 'Objects'} Detected</h3><span>Analysis complete</span></div>{detections.map((detection, index) => { const confidence = Number(detection.confidence); const displayConfidence = Number.isFinite(confidence) ? confidence.toFixed(2) : '0.00'; const progress = Math.min(100, Math.max(0, Number.isFinite(confidence) ? confidence : 0)); return <article className="detection-card" key={`${detection.class}-${index}`} aria-label={`Detection ${index + 1}: ${detection.class}, ${displayConfidence} percent confidence`}><div className="detection-card-header"><span>Detection #{index + 1}</span><b>{displayConfidence}%</b></div><strong>{detection.class}</strong><div className="confidence-track" role="progressbar" aria-label={`${detection.class} confidence`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div></article> })}</div>}
    </section>
  )
}

export default DetectionResults