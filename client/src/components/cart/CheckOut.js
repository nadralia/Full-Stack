import React, { useState } from "react";
import ChooseAddressToDeliver from "./ChooseAddressToDeliver";
import ChooseOrderPayment from "./ChooseOrderPayment";

const CheckOut = () => {
  const [renderView, setRenderView] = useState(null);

  function clickBtn(e) {
    setRenderView(e);
  }

  switch (renderView) {
    case "choose-payment":
      return <ChooseOrderPayment clickBtn={clickBtn} />;
    default:
      return <ChooseAddressToDeliver clickBtn={clickBtn} />;
  }
};

export default CheckOut;
