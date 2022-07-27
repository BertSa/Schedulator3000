import { Box, TableCell, TableRow } from '@mui/material';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { Employee } from '../../../models/User';
import useAvailabilitiesService from '../../../hooks/use-services/useAvailabilitiesService';
import useNoteService from '../../../hooks/use-services/useNoteService';
import useNullableState from '../../../hooks/useNullableState';
import { INote } from '../../EmployeeManagement/models/INote';
import { IAvailabilities } from '../../availiability/models/IAvailabilities';
import EditableTextField from '../../../components/EditableTextField';
import useUpdateEffect from '../../../hooks/useUpdateEffect';
import ScheduleTableCellAvailability from './ScheduleTableCellAvailability';

export default function ScheduleTableRowMoreDetails({ open, employee }: { open: boolean, employee: Employee }) {
  const availabilitiesService = useAvailabilitiesService();
  const noteService = useNoteService();

  const [note, setNote] = useNullableState<INote>();
  const [availabilities, setAvailabilities] = useNullableState<IAvailabilities>();

  useUpdateEffect(() => {
    noteService.getByEmployeeEmail(employee.email).then(setNote);
    availabilitiesService.getByEmployeeEmail(employee.email).then(setAvailabilities);
  }, [open]);

  if (!open || !note) {
    return null;
  }

  return (
    <>
      <TableRow>
        <TableCell sx={{ border: 0 }} colSpan={2} />
        <ScheduleTableCellAvailability availability={availabilities?.sunday} />
        <ScheduleTableCellAvailability availability={availabilities?.monday} />
        <ScheduleTableCellAvailability availability={availabilities?.tuesday} />
        <ScheduleTableCellAvailability availability={availabilities?.wednesday} />
        <ScheduleTableCellAvailability availability={availabilities?.thursday} />
        <ScheduleTableCellAvailability availability={availabilities?.friday} />
        <ScheduleTableCellAvailability availability={availabilities?.saturday} />
        <TableCell sx={{ border: 0 }} />
      </TableRow>
      <TableRow className="myRow">
        <TableCell width="100%" colSpan={10}>
          <Box component="form" noValidate autoComplete="off">
            <EditableTextField
              defaultValue={note?.text ?? ''}
              onConfirm={((text) => noteService.update(employee.email, { ...note, text } as INote).then(setNote))}
              textHelper={`Last edited on:${note?.lastModified
                ? format(parseISO(note.lastModified.toString()), 'yyyy-MM-dd hh:mm') : 'Never'}`}
            />
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}
