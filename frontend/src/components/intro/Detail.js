import { useState } from "react";
import Bio from "./Bio";

export default function Detail({ header, placeholder, name, inputHandler}) {
  return (
    <div>
      <div className="details_header">{header}</div>
      <div className="add_details_flex ">
          <>
            <i className="rounded_plus_icon"></i>
            Thêm {header}
          </>
      </div>
      <Bio placeholder={placeholder} name={name} inputHandler={inputHandler} />
    </div>
  );
}
