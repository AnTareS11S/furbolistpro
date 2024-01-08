/* eslint-disable react/prop-types */

import { useState } from 'react';
import ModalDialog from '../../ModalDialog';
import { useOnSuccessUpdate } from '../../hooks/useOnSuccessUpdate';

const DeleteLeague = ({ row, onLeagueUpdated }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useOnSuccessUpdate(updateSuccess, () => {
    onLeagueUpdated();
    setUpdateSuccess(false);
  });

  const handleDeleteLeague = async () => {
    try {
      const res = await fetch(`/api/admin/leagues/delete/${row._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete league!');
      }
      setUpdateSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='flex items-center space-x-4'>
      <ModalDialog
        description='Are you sure you want to delete this league?'
        handleClick={handleDeleteLeague}
      />
    </div>
  );
};

export default DeleteLeague;
