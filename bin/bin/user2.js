// user

var path=require('./prismpath.json');
var sf = require(path.prismbin+'serverflow');

		function User(username){
			this.username=username;
			var getDisplayname = function() {
					return new Promise(resolve=>{
						sf.getinfodb('select DisplayName,position from prismusers where username="'+username+'"',function(r){
							if(r.length>0){
								resolve(r);
							}else{
								resolve();
							}

						});
					})
			}

			async function asyncds(){
				return await getDisplayname();
			}
			this.DisplayNamePromise=asyncds();
			this.DisplayName;
			this.validPassword= function(password){
				var checkpasswordasync=function(username){
					return new Promise(resolve=>{
						sf.getinfodb('select exists(select * from prismusers where username="'+username+'" and password="'+password+'" ) as pwcheck',function(r){
							resolve(r[0].pwcheck);
						})
					});
				}
				async function asyncparent(username){
					return await checkpasswordasync(username);
				}
				const pcheck = asyncparent(this.username);
				return pcheck;

			}
			this.position;
			

		}
	
module.exports={
	findOne:function(i,callback){
		var user = new User(i.username);
			user.DisplayNamePromise.then(ds=>{
				if(ds){
					callback(null,user);
					user.DisplayName=ds[0].DisplayName;
					user.position=ds[0].position;
				}else{
					callback(null);
				}

				delete user.DisplayNamePromise;

			})

	},
	findById:function(id,callback){
		var user = new User(id);
		delete user.validPassword;
		user.DisplayNamePromise.then(ds=>{
			console.log(ds);
			user.DisplayName=ds[0].DisplayName;
			user.position=ds[0].position;
			delete user.DisplayNamePromise;
			callback(null,user)
		});
	}
}
