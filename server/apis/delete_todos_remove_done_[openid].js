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
	var openid = request.params.openid;
	var rowNum = db.sql('DELETE FROM todos WHERE openid="'+openid+'" AND done IS NOT NULL');
	return {ok:true, data: db.select('todos', {where: {openid: openid}})};
}