import { Navigate, NavigateAction, View } from 'react-big-calendar';
import React from 'react';
import { Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { addDays, format } from 'date-fns';
import { ArrowBack, ArrowForward, SvgIconComponent } from '@mui/icons-material';
import { OneOf } from '../../../models/OneOf';

interface IScheduleCalendarToolbarProps {
  date: Date;
  view: View;
  onView: (view: View) => void;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
}

function NavigationButton({ onClick, iconOrText: Icon }:{ onClick:VoidFunction, iconOrText:OneOf<SvgIconComponent, string> }) {
  return (
    <Button sx={{ height: '100%' }} color="inherit" onClick={onClick}>
      {typeof Icon === 'string' ? Icon : <Icon />}
    </Button>
  );
}

export default function ScheduleCalendarToolbar({
  onNavigate,
  onView,
  view,
  date,
}: IScheduleCalendarToolbarProps) {
  const selectedTab = view === 'work_week' ? 1 : 0;
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === 0) {
      onView('week');
    } else if (newValue === 1) {
      onView('work_week');
    }
  };

  return (
    <Grid container sx={{ width: '100%' }} paddingBottom={3}>
      <Grid item xs={4}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ width: 'auto', minWidth: 0 }}
        >
          <Tab label="Week" />
          <Tab label="Work Week" />
        </Tabs>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {format(date, 'MMM dd')}
          {' to '}
          {format(addDays(date, 6), 'MMM dd')}
        </Typography>
      </Grid>
      <Grid item xs={4} display="flex" justifySelf="flex-end" justifyItems="flex-end" justifyContent="flex-end">
        <NavigationButton iconOrText={ArrowBack} onClick={() => onNavigate(Navigate.PREVIOUS)} />
        <NavigationButton iconOrText="Today" onClick={() => onNavigate(Navigate.TODAY)} />
        <NavigationButton iconOrText={ArrowForward} onClick={() => onNavigate(Navigate.NEXT)} />
      </Grid>
    </Grid>
  );
}
