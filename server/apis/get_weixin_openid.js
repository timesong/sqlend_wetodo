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
	var code = request.query.code
	console.debug("code=%s", code);
	var weixin = plugin.weixin;
	weixin.setup({appid: 'your weixin appid', secret: 'your weixin app secret'});
	var result = weixin.execute('code2openid', code);
	console.debug(result);
	return result;
}