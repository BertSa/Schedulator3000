import { Menu, MenuItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ContentCopy, Delete, Edit } from '@mui/icons-material';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Nullable } from '../../../models/Nullable';
import { IContextMenuStates } from './ScheduleCalendarManager';
import { IShiftEvent } from '../models/IShiftEvent';

interface IContextMenuProps {
  contextMenu: Nullable<IContextMenuStates>,
  handleClose: VoidFunction,
  actions: {
    editAction: (selectedValue: IShiftEvent) => void,
    deleteAction: VoidFunction,
  },
}

export default function ContextMenu({ contextMenu, handleClose, actions: { editAction, deleteAction } }:IContextMenuProps) {
  const edit = () => {
    if (!contextMenu?.shiftEvent) {
      return;
    }
    editAction(contextMenu.shiftEvent);
    handleClose();
  };

  const duplicate = () => {
    if (!contextMenu?.shiftEvent) {
      return;
    }
    editAction(contextMenu.shiftEvent);
    handleClose();
  };

  const del = () => {
    deleteAction();
    handleClose();
  };

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
      <MenuItem onClick={edit}>
        <ListItemIcon>
          <Edit fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <MenuItem onClick={duplicate}>
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
      </MenuItem>
      <MenuItem onClick={del} sx={{ alignContent: 'center' }}>
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
}
