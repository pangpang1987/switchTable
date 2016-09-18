# switchTable
A simple table display for admin users

## Functions
> ### Display a subset of the table data with following columns:
- [x] First name
- [x] Last name
- [x] Email
- [x] Role
- [x] Department
> ### Sort by any of the above columns.
> ### Search users by keyword.
** BUG: ** The searching keyword can not be shorter than 3 charactors.
** Reason: ** MySql configuration for full text index search size.
> ### Provide detailed view, including age.
** Feature Changed: ** Rather than click on a button/link, use highlighted row click instead.
> ### The table should support pagination for up to 10 people per page.
** Feature Added: ** Pagination size change.
