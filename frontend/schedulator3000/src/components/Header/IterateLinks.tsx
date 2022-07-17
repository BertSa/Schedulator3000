import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { employeeLinks, managerLinks } from '../../data/navbarLinks';

interface IterateLinksProps {
  component: any,
  handleClose?: VoidFunction
}

export default function IterateLinks({ component: C, handleClose }: IterateLinksProps) {
  const auth = useAuth();
  let children: any = null;

  if (auth.isManager()) {
    children = managerLinks.map((value, index) =>
      <C key={index} text={value.text} path={value.path} handleClose={handleClose} />,
    );
  }
  if (auth.isEmployee()) {
    children = employeeLinks.map((value, index) =>
      <C key={index} text={value.text} path={value.path} handleClose={handleClose} />,
    );
  }

  return children ?? <span />;
}

IterateLinks.defaultProps = {
  handleClose: () => {},
};
