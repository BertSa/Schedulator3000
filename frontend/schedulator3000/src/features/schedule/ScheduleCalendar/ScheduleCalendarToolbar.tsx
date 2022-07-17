/* eslint-disable no-shadow */
import { Navigate, NavigateAction, View } from 'react-big-calendar';
import React from 'react';
import { Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { addDays, format } from 'date-fns';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

export default function ScheduleCalendarToolbar({
  onNavigate,
  onView,
  view,
  date,
}: {
  onView: (view: View) => void;
  view: View;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
  date: Date;
}) {
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
        <Button sx={{ height: '100%' }} color="inherit" onClick={() => onNavigate(Navigate.PREVIOUS)}>
          <ArrowBack />
        </Button>
        <Button sx={{ height: '100%' }} color="inherit" onClick={() => onNavigate(Navigate.TODAY)}>
          Today
        </Button>
        <Button sx={{ height: '100%' }} color="inherit" onClick={() => onNavigate(Navigate.NEXT)}>
          <ArrowForward />
        </Button>
      </Grid>
    </Grid>
  );
}
