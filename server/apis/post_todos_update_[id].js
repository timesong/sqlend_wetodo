/*
 * Global objects description:
 * console: Logger object. For example: console.debug(...), console.error(...), etc.
 * db:      Database object. For example: db.select('table1'), db.insert(...), db.update(...) etc.
 * store:   Storage object. For example: store.upload(...).
 * $:       Global function calling. For example: $.put_order(...).
 * header:  Header object.
 * request: Request object. have 5 sub-objects: request.body, request.params, request.query, request.forms, request.files.
 */

function main() {
	var id = request.params.id;
	var action = request.forms.action;
	var updateData = {}
	var result = {ok: false}

	if (action == 'done') {
		updateData.done = Date();
	} else if (action == 'pending') {
		updateData.done = null;
	} else {
		updateData.content = request.forms.content;
	}

	try {
		var rowNum = db.update('todos', updateData, {where: {id: id}});
		result.ok = true;
		result.data = updateData.done;
	} catch (error){
		result.data = error;
	}

	return result;
}