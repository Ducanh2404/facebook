export default function Bio({
  placeholder,
  name,
  inputHandler
}) {
  return (
    <div className="add_bio_wrap">
      <textarea
        placeholder={placeholder}
        name={name}
        maxLength="100"
        className="textarea_blue details_input"
        onChange={inputHandler}
      ></textarea>
      <div className="flex">
        <div className="flex flex_left">
          <i className="public_icon"></i>Công khai
        </div>
      </div>
    </div>
  );
}
