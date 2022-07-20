import { Menu, MenuItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ContentCopy, Delete, Edit } from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Nullable } from '../../../models/Nullable';
import { IContextMenuStates } from './ScheduleCalendarManager';
import { IShiftEvent } from '../models/IShiftEvent';

export default function ContextMenu({ contextMenu, handleClose, actions: { editAction, deleteAction } }:
{
  contextMenu: Nullable<IContextMenuStates>,
  handleClose: VoidFunction, actions: {
    editAction: (selectedValue: IShiftEvent) => void,
    deleteAction: VoidFunction,
  }
}) {
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      onContextMenu={(e: any) => {
        e.preventDefault();
        handleClose();
      }}
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={() => {
        if (!contextMenu?.shiftEvent) {
          return;
        }
        editAction(contextMenu.shiftEvent);
        handleClose();
      }}
      >
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => {
        if (!contextMenu?.shiftEvent) {
          return;
        }
        editAction(contextMenu.shiftEvent);
        handleClose();
      }}
      >
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
      </MenuItem>
      <MenuItem
        sx={{ alignContent: 'center' }}
        onClick={() => {
          deleteAction();
          handleClose();
        }}
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}
