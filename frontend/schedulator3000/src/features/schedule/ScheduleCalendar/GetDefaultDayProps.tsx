import { Color, PaletteColor } from '@mui/material';
import React from 'react';
import { isToday } from 'date-fns';

export default function getDefaultDayProps(date: Date, secondary: PaletteColor, grey: Color) {
  const day = date.getDay();
  let dayProp: React.HTMLAttributes<HTMLDivElement> = {
    style: {
      color: '#FFF',
    },
  };

  if (isToday(date)) {
    dayProp = {
      ...dayProp,
      style: {
        ...dayProp.style,
        color: secondary.main,
        backgroundColor: `${secondary.main}99`,
      },
    };
  }

  if (day === 0 || day === 6) {
    dayProp = {
      ...dayProp,
      style: {
        backgroundColor: `${grey['800']}DD`,
        ...dayProp.style,
      },
    };
  }

  return dayProp;
}
