import React from "react";

import Skeleton from '@mui/material/Skeleton';


export default function SkeletonLoader(props) {
  return (
    <div>
      <Skeleton animation="wave" height={50} width={300} />
      <Skeleton animation="wave" height={40} width={160} />
      <Skeleton animation="wave" height={40} width={160} />
      <Skeleton animation="wave" height={40} width={160} />
      <Skeleton animation="wave" height={60} />
    </div>
  )
}
