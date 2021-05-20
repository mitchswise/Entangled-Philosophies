url/login | Logs in an existing user
--- | ---
HTTP Request | POST
Required Inputs | username and unhashed password
Optional Inputs | n/a
Successful Output | JSON with userID, error_code = 0, error_message = ""
Error Output | JSON with error_code = 1 or 2, error_message describing issue

url/setPerms | Updates permission level of a user
--- | ---
HTTP Request | POST
Required Inputs | username, permission_level
Optional Inputs | n/a
Successful Output | JSON with status:success
Error Output | JSON with status:error

url/getPerms | Checks the permission level of a user
--- | ---
HTTP Request | POST
Required Inputs | username
Optional Inputs | n/a
Successful Output | JSON with permission_level
Error Output | JSON with error:user not found

url/getAdmins | Gets all admin or super admin users
--- | ---
HTTP Request | POST
Required Inputs | n/a
Optional Inputs | n/a
Successful Output | JSON with array of usernames and ids
Error Output | JSON with error:no admins found

url/addTag | Adds a user-created or admin tag
--- | ---
HTTP Request | POST
Required Inputs | JSON with different fields if admin or user<br />userID: 0 if admin, regular user ID otherwise<br />language: the preferred language of the user adding the tag (used to identify the category being referenced)<br />category: the name of the category<br />
Optional Inputs | n/a
Successful Output | JSON with a successful "status" field
Error Output | JSON with a "status" field describing the error
