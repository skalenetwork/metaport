import React from "react";
import Skeleton from '@mui/material/Skeleton';

import styles from '../WidgetUI/WidgetUI.scss';


export default function SkeletonLoader(props) {
  return (
    <div className={styles.mp__margTop10}>
      {props.header ? <Skeleton animation="wave" height={50} width={300} /> : null}
      <Skeleton animation="wave" height={40} width={160} />
      <Skeleton animation="wave" height={40} width={160} />
      <Skeleton animation="wave" height={60} />
    </div>
  )
}
