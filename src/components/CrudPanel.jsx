/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomDataTable from './CustomDataTable';
import ModalActions from './ModalActions';

const CrudPanel = ({
  apiPath,
  columns,
  fields,
  title,
  onEditComponent: EditComponent,
  onDeleteComponent: DeleteComponent,
  onAddTeamComponent: AddTeamComponent,
  onRemoveTeamComponent: RemoveTeamComponent,
  defaultValues,
  formSchema,
  isExpandable,
  objectId,
  isAction,
  ...rest
}) => {
  const [data, setData] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema(false)),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  });

  const fetchData = async () => {
    try {
      const endpoint = objectId ? `${apiPath}/${objectId}` : apiPath;
      const res = await fetch(`/api/admin/${endpoint}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    setUpdateSuccess(false);
  }, [updateSuccess, objectId]);

  const onSubmit = async (formData) => {
    const data = new FormData();

    for (const key in formData) {
      if (key === 'logo') {
        data.append(key, file || formData.logo);
        continue;
      }
      data.append(key, formData[key]);
    }

    try {
      if (apiPath === 'team') {
        const nameExists = await fetch(
          `/api/team/check-team-name?name=${formData.name}`
        );

        const nameData = await nameExists.json();

        if (nameData.exists) {
          form.setError('name', {
            type: 'manual',
            message: 'Name already exists',
          });
          setUpdateSuccess(false);
          return;
        }
      }

      const endpoint = objectId ? `${apiPath}/${objectId}` : apiPath;
      const res = await fetch(`/api/admin/${endpoint}/add`, {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data!');
      }

      setUpdateSuccess(true);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEntityUpdated = () => {
    fetchData();
  };

  return (
    <>
      {fields && (
        <ModalActions
          label='Add'
          onSubmit={onSubmit}
          title={`Add ${title}`}
          desc={`Add a new ${title}`}
          form={form}
          fields={fields}
          setFile={setFile}
        />
      )}
      <CustomDataTable
        columns={[
          ...columns,
          isAction && {
            name: 'Actions',
            cell: (row) => {
              const teams = row?.teams?.map((team) => team?._id);
              return (
                <div className='flex items-center space-x-4'>
                  {EditComponent && (
                    <EditComponent
                      row={row}
                      onEntityUpdated={handleEntityUpdated}
                      apiEndpoint={apiPath}
                      formSchema={formSchema}
                      fields={fields}
                      defaultValues={defaultValues}
                    />
                  )}
                  {AddTeamComponent && (
                    <AddTeamComponent
                      row={row}
                      onEntityUpdated={handleEntityUpdated}
                    />
                  )}
                  {RemoveTeamComponent && (
                    <RemoveTeamComponent
                      row={row}
                      teams={teams}
                      onEntityUpdated={handleEntityUpdated}
                    />
                  )}
                  {DeleteComponent && (
                    <DeleteComponent
                      row={row}
                      onEntityDelete={handleEntityUpdated}
                      apiEndpoint={apiPath}
                    />
                  )}
                </div>
              );
            },
            grow: RemoveTeamComponent ? 0.5 : 0,
          },
        ]}
        data={data}
        pagination
        pending
        isExpandable={isExpandable}
        {...rest}
      />
    </>
  );
};

export default CrudPanel;
