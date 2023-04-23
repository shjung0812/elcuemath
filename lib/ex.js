/*
const person = {
	name:['bob','Smith'],
	age:32,
	gender:'male',
	interests:['music','skiing'],
	bio:function(){
		console.log(this.name[0]+' '+this.name[1])
	},
	greeting:function(){
		console.log('hi im ' + this.name[0]+'.');
	}
};
console.log(person.name);
console.log(person.name[0]);
console.log(person.age);
console.log(person.interests[1]);
person.bio();
person.greeting();



function Car(a,b,c){
	this.aa=a;
	this.bb=b;
	this.cc=c;
}


var mycar = new Car('korea','japan','china');

Car.prototype.dd='sexy';
mycar.dd='usa';

var yourcar = new Car('mogolia','india','argentina');

console.log(mycar.dd);
console.log(yourcar.dd);


const object1 = {};
Object.defineProperty(object1, 'property1',{
	value:42,
	writable:false
});

object1.property1 = 77;

console.log(object1.property1);
*/



var now =  new Date();
console.log(now.year);

var d = Date.prototype;
Object.defineProperty(d,'year',{
	get: function() {return this.getFullYear();},
	set: function(y) {this.setFullYear(y+1);}
});

console.log(now.year);
now.year=now.year;
console.log(now.year);

