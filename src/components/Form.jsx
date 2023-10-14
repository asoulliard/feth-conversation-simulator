export default function Form({
  name,
  emotion,
  portrait,
  text,
  portraits,
  emotions,
  onNameChange,
  onPortraitChange,
  onEmotionChange,
  onTextChange,
  onDownload,
}) {
  const portraitList = portraits.map((portrait) => (
    <option key={portrait} value={portrait}>
      {portrait}
    </option>
  ));

  const emotionList = emotions.map((emotion) => (
    <option key={emotion} value={emotion}>
      {emotion}
    </option>
  ));

  return (
    <form>
      <div className="row mb-4">
        <div className="col-12 col-md-4">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            value={name}
            onChange={onNameChange}
            aria-autocomplete="none"
          />
        </div>
        <div className="col">
          <label>Portrait</label>
          <select
            className="form-control"
            value={portrait}
            onChange={onPortraitChange}
          >
            {portraitList}
          </select>
        </div>
        <div className="col">
          <label>Emotion</label>
          <select
            className="form-control"
            value={emotion}
            onChange={onEmotionChange}
          >
            {emotionList}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Text</label>
        <textarea
          className="form-control"
          value={text}
          onChange={onTextChange}
          rows="3"
          placeholder="Text"
          aria-autocomplete="none"
        ></textarea>
      </div>
      <a onClick={onDownload} className="btn btn-block btn-anna mb-3" href="#">
        Download {name}.png
      </a>
    </form>
  );
}
