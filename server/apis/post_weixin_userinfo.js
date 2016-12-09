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
	var data = JSON.parse(request.body)
	// console.debug("data=%s", data);
	var weixin = plugin.weixin;
	weixin.setup({appid: 'your weixin appid', secret: 'your weixin app secret'});
	var result = weixin.execute('decrypt_userinfo', data);
	// console.debug(result);

	if (result.ok) {
		var openid = result.data.openId;
		delete result.data["openId"];
		result.data.openid = openid;

		if (db.select('wx_users', {where: {openid: openid}}).length == 0) {
			db.insert('wx_users', result.data);
		}
	}
	
	return result;
}