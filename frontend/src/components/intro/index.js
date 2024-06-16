import "./style.css";
import EditDetails from "./EditDetails";

export default function Intro({ openEditBox, setOpenEditBox, setRefreshDetails }) {
  return (
    <div className="profile_card">
      <EditDetails openEditBox={openEditBox} setOpenEditBox={setOpenEditBox} setRefreshDetails={setRefreshDetails} />
    </div>
  );
}
