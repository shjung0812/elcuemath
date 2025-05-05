


function displayThisWeekPSREgraph(psred,divin,induser){
	var displaydiv=document.createElement('div');
	displaydiv.id='dtwpsrediv';

	var chartdiv=document.createElement('div');
	chartdiv.id='dtwpsrechartdiv'
	var canvasdiv=document.createElement('canvas');
	canvasdiv.id='dtwpsremyChart';
	chartdiv.appendChild(canvasdiv);
	displaydiv.appendChild(chartdiv);

	var thisweektime=document.createElement('div');
	thisweektime.id='dtwpsrethisweektime';
	displaydiv.appendChild(thisweektime);


	document.getElementById(divin).appendChild(displaydiv);	
	


	//var dateref2=new Date('2021-08-16').getTime()/1000/60/60/24; //monday start
	var dateref=new Date('2020-01-06').getTime()/1000/60/60/24; //monday start
	//don't know about the reason but, the date indicate sunday but dateref indicate monday. so there is difference the written date and result date code. 
	var dateoftoday=Math.floor(new Date().getTime()/1000/60/60/24);
	var dateoftoday2=new Date().getTime()/1000/60/60/24;

	var weekofhbegin=dateoftoday-(dateoftoday-dateref)%7;
	
	
	var weekofprocessing=weekofhbegin;
	console.log(psred);
	var psre7data=[];
	var hdate=new Date(weekofprocessing*1000*3600*24);
	for(var ib=0; ib<induser.length;ib++){
		//hw7data
		psre7data[ib]={evalratio:0,username:induser[ib][0],date:toDate(hdate),DisplayName:induser[ib][1]}
		var allmustinstruct=0;
		var evaledinstruct=0;
		for(var ia=0; ia<psred.length; ia++){
			var dateofpic=Math.floor(new Date(psred[ia].createdate.split(' ')[0]).getTime()/1000/60/60/24);
			if(weekofprocessing <= dateofpic && dateofpic< weekofprocessing+7 && psred[ia].username==induser[ib][0]){
				//if(psred[ia].hisopt == 'hw'){
					//evaledinstruct+=1;
				//}
				if(psred[ia].evaldate!=null){
					evaledinstruct+=1;
				}
				allmustinstruct+=1;
			}

		}

		if(allmustinstruct==0){
			psre7data[ib].evalratio=0;
		}else{
			psre7data[ib].evalratio=(evaledinstruct/allmustinstruct)*100;
			//psre7data[ib].evalratio=Math.ceil(evaledinstruct/allmustinstruct);
		}
		/*
		if(Math.ceil(addedtime/60)>stmaxmin){
			stmaxmin=Math.ceil(addedtime/60);
		}*/



	}

	console.log('psre7data',psre7data);
	var disdata=[];
	var bgcolor=[];
	for(var ia=0; ia<psre7data.length; ia++){
		disdata.push({x:psre7data[ia].DisplayName,y:psre7data[ia].evalratio});
		/*
		if(cutoffscore[0] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(239,240,230,.4)' //white
		}else if(cutoffscore[1] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(244,246,93,1)' //yellow
		}else if(cutoffscore[2] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(47,146,9,1)' //green
		}else if(cutoffscore[3] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(27,61,213,1)' //blue
		}else if(cutoffscore[4] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(207,126,40,1)' //gal
		}else if(cutoffscore[5] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(207,57,23,1)' //red
		}else{
			bgcolor[ia]='rgba(22,5,1,1)'
		}*/
	}


	var ctx=document.getElementById('dtwpsremyChart').getContext('2d');
	var myChart = new Chart(ctx,{
		type:'bar',
		data:{
			datasets:[{
				label:'Evaluate % per week',
				data:disdata,
				//backgroundColor:bgcolor,
				//backgroundColor:[
					//'rgba(255,99,132,.5)'
				//],
				borderWidth:1
			}]
		},
		options:{
			title:{
				display:true,
				fontSize:10
			},
			scales:{
				y:{
					max:110
				}
				
			}
		}

	});


}




var cutoffscore=[60,180,360,720,1440,2160];


function displayThisWeekHWgraph(hwdata,divin,induser){
	var displaydiv=document.createElement('div');
	displaydiv.id='dtwhdiv';

	var chartdiv=document.createElement('div');
	chartdiv.id='dtwhchartdiv'
	var canvasdiv=document.createElement('canvas');
	canvasdiv.id='dtwhmyChart';
	chartdiv.appendChild(canvasdiv);
	displaydiv.appendChild(chartdiv);

	var thisweektime=document.createElement('div');
	thisweektime.id='dtwhthisweektime';
	displaydiv.appendChild(thisweektime);


	document.getElementById(divin).appendChild(displaydiv);	
	


	//var dateref2=new Date('2021-08-16').getTime()/1000/60/60/24; //monday start
	var dateref=new Date('2020-01-06').getTime()/1000/60/60/24; //monday start
	//don't know about the reason but, the date indicate sunday but dateref indicate monday. so there is difference the written date and result date code. 
	var dateoftoday=Math.floor(new Date().getTime()/1000/60/60/24);
	var dateoftoday2=new Date().getTime()/1000/60/60/24;

	var weekofhbegin=dateoftoday-(dateoftoday-dateref)%7;
	console.log(weekofhbegin, 'weekofhbegin', dateoftoday, (dateoftoday-dateref)%7,dateoftoday2);
	
	
	var weekofprocessing=weekofhbegin;
	


	var hw7data=[];
	var hdate=new Date(weekofprocessing*1000*3600*24);
	var stmaxmin=0;
	for(var ib=0; ib<induser.length;ib++){
		//hw7data
		hw7data[ib]={addedtime:0,username:induser[ib][0],date:toDate(hdate),DisplayName:induser[ib][1]}
		var addedtime=0;
		for(var ia=0; ia<hwdata.length; ia++){
			var dateofpic=Math.floor(new Date(hwdata[ia].createdate.split(' ')[0]).getTime()/1000/60/60/24);

			if(weekofprocessing <= dateofpic && dateofpic< weekofprocessing+7 && hwdata[ia].username==induser[ib][0]){
				//var hdate=new Date(weekofprocessing*1000*3600*24);
				//console.log(toDate(hdate));
				//console.log(hwdata[ia].createdate);

				addedtime=addedtime+hwdata[ia].timepassed;
			}

		}

		hw7data[ib].addedtime=Math.ceil(addedtime/60);
		if(Math.ceil(addedtime/60)>stmaxmin){
			stmaxmin=Math.ceil(addedtime/60);
		}



	}


	var disdata=[];
	var bgcolor=[];
	for(var ia=0; ia<hw7data.length; ia++){
		disdata.push({x:hw7data[ia].DisplayName,y:hw7data[ia].addedtime});
		if(cutoffscore[0] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(239,240,230,.4)' //white
		}else if(cutoffscore[1] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(244,246,93,1)' //yellow
		}else if(cutoffscore[2] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(47,146,9,1)' //green
		}else if(cutoffscore[3] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(27,61,213,1)' //blue
		}else if(cutoffscore[4] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(207,126,40,1)' //gal
		}else if(cutoffscore[5] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(207,57,23,1)' //red
		}else{
			bgcolor[ia]='rgba(22,5,1,1)'
		}
	}


	var ctx=document.getElementById('dtwhmyChart').getContext('2d');
	var myChart = new Chart(ctx,{
		type:'bar',
		data:{
			datasets:[{
				label:'My Homework spent time (in min) per week',
				data:disdata,
				backgroundColor:bgcolor,
				//backgroundColor:[
					//'rgba(255,99,132,.5)'
				//],
				borderWidth:1
			}]
		},
		options:{
			title:{
				display:true,
				fontSize:10
			},
			scales:{
				y:{
					max:stmaxmin+50
				}
				
			}
		}

	});


}

function toDate(b){
	let fullyear = b.getFullYear();
	let month = b.getMonth()+1;
	let day = b.getDate();
	return fullyear+'-'+month+'-'+day;
}

function hwhistoryData(hwdata,divin){//displaydivid, chartdivid, canvasdivid,thisweektimeid,
	var displaydiv=document.createElement('div');
	displaydiv.id='displaydiv';

	var chartdiv=document.createElement('div');
	chartdiv.id='chartdiv'
	var canvasdiv=document.createElement('canvas');
	canvasdiv.id='myChart';
	chartdiv.appendChild(canvasdiv);
	displaydiv.appendChild(chartdiv);

	var thisweektime=document.createElement('div');
	thisweektime.id='thisweektime';
	displaydiv.appendChild(thisweektime);


	document.getElementById(divin).appendChild(displaydiv);	
	


	var dateref=new Date('2020-01-06').getTime()/1000/60/60/24; //monday start
	var dateoftoday=Math.floor(new Date().getTime()/1000/60/60/24);


	if(hwdata.length!=0){
		var fday=new Date(hwdata[0].createdate.split(' ')[0])
		//var fday=new Date(hwdata[0].createdate) - iOS is not Allowed this form
		var dateoffirstpic=Math.floor(fday.getTime()/1000/60/60/24);
	}else{
		var dateoffirstpic=dateoftoday
	}
	var weekofhbegin=dateoffirstpic-(dateoffirstpic-dateref)%7;
	
	var weekofprocessing=weekofhbegin;

	var hw7data=[];
	var num=1;

	var begindate=new Date(weekofprocessing*1000*3600*24);
	var k=new Date();
	hw7data.push({num:num, date:toDate(begindate),addedtime:0})
	var test=0;
	var stmaxmin=0;
	while(weekofprocessing <= dateoftoday){
		var addedtime=0;
		for(var ia=0; ia<hwdata.length; ia++){
			var dateofpic=Math.floor(new Date(hwdata[ia].createdate.split(' ')[0]).getTime()/1000/60/60/24);

			if(weekofprocessing <= dateofpic && dateofpic< weekofprocessing+7){
				//var hdate=new Date(weekofprocessing*1000*3600*24);
				//console.log(toDate(hdate));
				//console.log(hwdata[ia].createdate);

				addedtime=addedtime+hwdata[ia].timepassed;
			}

		}

		hw7data[hw7data.length-1].addedtime=Math.ceil(addedtime/60);
		if(Math.ceil(addedtime/60)>stmaxmin){
			stmaxmin=Math.ceil(addedtime/60);
		}

		num+=1;
		var hdate=new Date(weekofprocessing*1000*3600*24);
		if(weekofprocessing+7 <= dateoftoday){
			hw7data.push({num:num, date:toDate(hdate),addedtime:0})
		}
		/*
		if(weekofprocessing == dateoftoday){
			var addedtime=0;
			for(var ia=0; ia<hwdata.length; ia++){
				var dateofpic=Math.floor(new Date(hwdata[ia].createdate.split(' ')[0]).getTime()/1000/60/60/24);

				if(weekofprocessing <= dateofpic && dateofpic< weekofprocessing+7){
					//var hdate=new Date(weekofprocessing*1000*3600*24);
					//console.log(toDate(hdate));
					//console.log(hwdata[ia].createdate);

					addedtime=addedtime+hwdata[ia].timepassed;
				}

			}
			hw7data[hw7data.length-1].addedtime=Math.ceil(addedtime/60);
		}*/

		weekofprocessing=weekofprocessing+7;

		test+=1;
		if(test>1000){
			console.log('infinite error');
			break;
		}
	}

	var disdata=[];
	var bgcolor=[];
	for(var ia=0; ia<hw7data.length; ia++){
		disdata.push({x:hw7data[ia].num+'week',y:hw7data[ia].addedtime});
		if(cutoffscore[0] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(239,240,230,.4)' //white
		}else if(cutoffscore[1] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(244,246,93,1)' //yellow
		}else if(cutoffscore[2] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(47,146,9,1)' //green
		}else if(cutoffscore[3] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(27,61,213,1)' //blue
		}else if(cutoffscore[4] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(207,126,40,1)' //gal
		}else if(cutoffscore[5] >= hw7data[ia].addedtime){
			bgcolor[ia]='rgba(207,57,23,1)' //red
		}else{
			bgcolor[ia]='rgba(22,5,1,1)'
		}
	}


	var ctx=document.getElementById('myChart').getContext('2d');
	var myChart = new Chart(ctx,{
		type:'bar',
		data:{
			datasets:[{
				label:'My Homework spent time (in min) per week',
				data:disdata,
				backgroundColor:bgcolor,
				//backgroundColor:[
					//'rgba(255,99,132,.5)'
				//],
				borderWidth:1
			}]
		},
		options:{
			title:{
				display:true,
				fontSize:10
			},
			scales:{
				y:{
					max:stmaxmin+50
				}
				
			}
		}

	});
	thisweektime.innerHTML=' My HW time this week : ' + disdata[disdata.length-1].y +'분';
	if(disdata[disdata.length-1].y <= cutoffscore[0]){
		thisweektime.style.color=bgcolor[0]
		console.log(0);
	}else if(disdata[disdata.length-1].y <= cutoffscore[1]){
		thisweektime.style.color=bgcolor[1]
		console.log(1);
	}else if(disdata[disdata.length-1].y <= cutoffscore[2]){
		thisweektime.style.color=bgcolor[2]
		console.log(2);
	}else if(disdata[disdata.length-1].y <= cutoffscore[3]){
		thisweektime.style.color=bgcolor[3]
		console.log(3);
	}else if(disdata[disdata.length-1].y <= cutoffscore[4]){
		thisweektime.style.color=bgcolor[4]
		console.log(4);
	}else if(disdata[disdata.length-1].y <= cutoffscore[5]){
		thisweektime.style.color=bgcolor[5]
		console.log(5);

	}else{
		thisweektime.style.color=bgcolor[6]
		console.log(6);
	}
	thisweektime.style.color=bgcolor[bgcolor.length-1]
	thisweektime.style.backgroundColor='rgba(15,15,15,.8)'

}



