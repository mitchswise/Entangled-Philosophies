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

<b>TAGS</b>

url/addTag | Adds a user-created or admin tag
--- | ---
HTTP Request | POST
Required Inputs | JSON with different fields if admin or user<br /><b>userID:</b> 0 if admin, regular user ID otherwise<br /><b>language:</b> the preferred language of the user adding the tag <br /><b>category:</b> the name of the category<br /><b>IF ADMIN:</b> a separate field for each supported language (uses 3 letter abbreviation like "eng")<br/><b>IF USER:</b> a single field with the name "def" for default placeholder for user tags.<br /><b>edit_tag</b>: if this endpoint call is to edit a tag instead of add a new one, pass in the id of the tag to edit (-1 if inserting a new tag).
Example Admin Input | {"userID": 0,<br/>    "language":"eng",<br/>    "category":"General",<br/>    "eng":"words",<br/>    "ger":"wörter",<br/>    "edit_tag":-1}
Optional Inputs | n/a
Successful Output | JSON with a successful "status" field
Error Output | JSON with a "status" field describing the error


url/removeTag | Removes a user-created or admin tag
--- | ---
HTTP Request | POST
Required Inputs | JSON with 3 fields:<br/><b>name</b>: the name of the tag to delete<br/><b>language</b>: the language the tag is in ("def" if user tag, other language if admin tag<br/><b>userID</b>: the id of the user calling the delete. Equal to 0 if an admin is deleting or the user id of the owner otherwise.
Example Input | {"name":"words", "language":"eng", "userID":0}
Optional Inputs | n/a
Successful Output | JSON with a "status" field saying tag is deleted
Error Output | JSON with a "status" field saying the tag does not exist/doesn't belong to you.

url/getTags | Returns all available tags to a user
--- | ---
HTTP Request | POST
Required Inputs | JSON with 2 fields:<br/><b>userID</b>: the ID of the user making the query (0 if admin, not 0 otherwise)<br/><b>language</b>: the preferred language of the user<br/>
Example Input | {"userID":115, "language":"eng"}
Optional Inputs | n/a
Successful Output | JSON array with all available tags. Fields of each JSON array element are: tag_id, text, owner, cat_id, catText. 'text' is the appropriately translated version of the tag, 'catText' is the appropriately translated version of the category name, and owner is 0 if admin owner or the userID of the owner if it's user-created.
Error Output | JSON with a "status" field describing the error that occurred.

url/getTagsTranslation | Returns all available translations of a single tag.
--- | ---
HTTP Request | POST
Required Inputs | JSON with 1 field:<br/><b>tag_id</b>: the ID of the tag
Example Input | {"tag_id":26}
Optional Inputs | n/a
Successful Output | JSON array a field for each supported language (currently english and german) if the requested tag is admin-owned. If the tag is a user tag, there will be a single field labelled "def" (for default langauge) containing the user's tag name.
Error Output | JSON with a "status" field describing the error that occurred.

url/addCategory | Adds a user-created or admin category
--- | ---
HTTP Request | POST
Required Inputs | Equivalent to <b>url/addTag</b> except you can remove the <b>language</b> and <b>category</b> fields and instead of <b>edit_tag</b> we use <b>edit_category</b>.
Example Input | {"userID": 0,<br/>    "eng":"General",<br/>    "ger":"Allgemeines",<br/>    "edit_category":-1}
Optional Inputs | n/a
Successful Output | JSON with a successful "status" field
Error Output | JSON with a "status" field describing the error

url/removeCategory | Removes a user-created or admin tag
--- | ---
HTTP Request | POST
Required Inputs | Same requirements as <b>url/removeTag</b>
Example Input | {"name":"General", "language":"eng", "userID":0}
Optional Inputs | n/a
Successful Output | JSON with a "status" field saying category is deleted
Error Output | JSON with a "status" field saying the category does not exist/doesn't belong to you.

url/getCategories | Returns all available categories to a user
--- | ---
HTTP Request | POST
Required Inputs | Same requirements as <b>url/getTags</b>
Example Input | {"userID":115, "language":"eng"}
Optional Inputs | n/a
Successful Output | JSON array with all available categories. Fields of each JSON array element are: cat_id, text, owner. 'text' is the appropriately translated version of the category and owner is 0 if admin owner or the userID of the owner if it's user-created.
Error Output | JSON with a "status" field describing the error that occurred.

url/getCategoriesTranslation | Returns all available translations of a single category.
--- | ---
HTTP Request | POST
Required Inputs | JSON with 1 field:<br/><b>cat_id</b>: the ID of the tag
Example Input | {"cat_id":26}
Optional Inputs | n/a
Successful Output | JSON array a field for each supported language (currently english and german) if the requested category is admin-owned. If the category is a user category, there will be a single field labelled "def" (for default langauge) containing the user's category name.
Error Output | JSON with a "status" field describing the error that occurred.
