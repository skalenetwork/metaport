import React from "react";
import { WidgetUI } from "./WidgetUI";
import { commonProps, defaultERC1155TokenData } from './StoriesHelper';


export default {
  title: "ERC1155 UI"
};

export const TransferNFT = () => (
  <WidgetUI {...commonProps} {...defaultERC1155TokenData} />
);
 