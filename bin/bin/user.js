// user

var path=require('./prismpath.json');
var sf = require(path.prismbin+'serverflow');

		function User(username){
			this.username=username;
			var getDisplayname = function() {
					return new Promise(resolve=>{
						sf.getinfodb('select DisplayName,position from prismusers where username="'+username+'"',function(r){
						sf.getinfodb('select pm.username from prismusers as pm join mmttconnection as mm on mm.childcol=pm.username where mm.conopt=0 and mm.parentcol="'+username+'" and pm.position=11',function(s){
							if(r.length>0){
								resolve([r,s]);
							}else{
								resolve();
							}

						});
						});
					})
			}

			async function asyncds(){
				return await getDisplayname();
			}
			this.DisplayNamePromise=asyncds();


			/*

			var getstdlist = function(){
				return new Promise(resolve=>{
					sf.getinfodb('select * from prismusers as pm join mmttconnection as mm on mm.childcol=pm.username where mm.conopt=0 and mm.parentcol="'+username+'" and pm.position=11',function(s){
						if(s.length > 0){
							resolve(s);
						}else{
							resolve();
						}
					});
				});
			}
			async function asyncstdlist(){
				return await getstdlist();
			}*/
			this.studentlist;

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
			//user.studentlist.then(st=>{
				if(ds){
					user.DisplayName=ds[0][0].DisplayName;
					user.position=ds[0][0].position;
					callback(null,user);
						
				}else{
					callback(null);
				}

				delete user.DisplayNamePromise;
				//delete user.studentlist;

			//});
			})

	},
	findById:function(id,callback){
		var user = new User(id);
		delete user.validPassword;
		user.DisplayNamePromise.then(ds=>{
			console.log(ds);
			user.DisplayName=ds[0][0].DisplayName;
			user.position=ds[0][0].position;
			var vstlist=[];
			for(var ia=0; ia<ds[1].length; ia++){
				vstlist.push(ds[1][ia].username);
			}
			user.studentlist=vstlist;
			delete user.DisplayNamePromise;
			callback(null,user)
		});
	}
}
