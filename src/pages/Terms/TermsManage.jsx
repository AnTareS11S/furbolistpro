import BackButton from '../../components/BackButton';
import CrudPanel from '../../components/CrudPanel';
import DeleteEntity from '../../components/DeleteEntity';
import EditEntity from '../../components/EditEntity';

import { Separator } from '../../components/ui/separator';
import { z } from 'zod';

const termsSchema = () =>
  z.object({
    term: z.string().min(3, 'Term is required'),
    content: z.string().min(3, 'Content is required'),
    active: z.boolean(),
  });

const TermsManage = () => {
  const columns = [
    {
      name: 'No.',
      selector: (row, index) => index + 1,
      grow: 0,
    },
    {
      name: 'Term',
      selector: (row) => row.term,
      sortable: true,
    },
    {
      name: 'Active',
      selector: (row) => (row.active ? 'Yes' : 'No'),
      sortable: true,
    },
  ];

  const fields = [
    {
      id: 'term',
      label: 'Term',
      type: 'text',
      name: 'term',
    },
    {
      id: 'content',
      label: 'Content',
      type: 'textarea',
      name: 'content',
    },
    {
      id: 'active',
      label: 'Active',
      type: 'checkbox',
      name: 'active',
    },
  ];

  return (
    <div className='space-y-6'>
      <BackButton />
      <div>
        <div className='text-heading2-bold'>Terms</div>
        <p className='text-sm text-muted-foreground'>Manage terms</p>
      </div>
      <Separator />
      <CrudPanel
        apiPath='terms'
        columns={columns}
        fields={fields}
        title='Terms'
        onEditComponent={EditEntity}
        onDeleteComponent={DeleteEntity}
        formSchema={termsSchema}
        defaultValues={{
          term: '',
          content: '',
          active: true,
        }}
        isExpandable={false}
        isAction={true}
      />
    </div>
  );
};

export default TermsManage;