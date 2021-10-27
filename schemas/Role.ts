import { relationship, text } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { permissions, rules } from '../access';
import { permissionFields } from './fields';

export const Role = list({
  // access: {
  //   operation: {
  //     create: rules.canManageRoles,
  //     query: rules.canManageRoles,
  //     update: rules.canManageRoles,
  //     delete: rules.canManageRoles,
  //   },
  // },
  // ui: {
  //   hideCreate: (args) => false,
  //   hideDelete: (args) => false,
  //   isHidden: (args) => false,
  // },
  fields: {
    name: text({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
