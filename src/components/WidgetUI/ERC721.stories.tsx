import React from "react";
import { WidgetUI } from "./WidgetUI";
import { commonProps, defaultERC721TokenData, generateTokenData } from './StoriesHelper';

import PublicOffIcon from '@mui/icons-material/PublicOff';


export default {
  title: "ERC721 UI"
};

export const TransferNFT = () => (
  <WidgetUI {...commonProps} {...defaultERC721TokenData} amountLocked={true} tokenId={250}/>
);
