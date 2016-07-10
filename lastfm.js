//trying to keep all the lastfm collection/proessing/output on one page --taylor

var LastfmAPI = require('lastfmapi');
var _ = require('underscore-node');
var $ = require("jquery")
var mongoose = require('mongoose');
mongoose.connect(require('../models/connect'))

var List=require('../models/artist')

var id=""
var mod= new List({});
mod.save(function(err,item){
	if(err){
		console.log(err)
	}
	else{
		id=item._id;
		//console.log(id)
	}
})

var times=0;

var lfm = new LastfmAPI({
	'api_key' : '9a09b3b6f2f046ad39b28327bf5477e6',
	'secret' : '47460a4caa8ab51daacfced86dcc574c'
});

var out=[]
var db=[]
var getArtists=function(artist){
	var s=0;
	lfm.artist.getSimilar({
		'artist': artist,
		'limit': 5
	}, function(err,track){
		if(err) {throw err}
			else{
			track.artist.map(function(a,i){
				//console.log('id is', id)
				if(!out[0]){
					out.push(a.name)
				}
				if(_.intersection(out,a.name)&&_.indexOf(db,a.name)===-1 ){
					console.log("Saving", a.name)
					db.push(a.name)
					List.findByIdAndUpdate(id,{
						$push: {artists: a.name},
					}, function(err) {
						if (err)
							console.error("Error saving Artist:", err);
						// else
						// 	console.log("Successfully saved")
					})
				}
				else{
					out.push(a.name)
				}
				
			})
			//console.log(out)
		}
	}
)
}


var getRelated= function(a1,a2,n){
var artist1= {};
var artist2={};
lfm.artist.getSimilar({
	'artist' : a1,
	'limit': 50
	}, function (err, track) {
		if (err) { throw err; }
		else{
			var count1=0;
				track.artist.map(function(a){
				lfm.artist.getTopTags({
					'artist' : a.name
				}, function (err, tag) {
					//console.log(tag)
					var tags=[];
					tag.tag.map(function(data){
					if(tags.length<10){

						tags.push(data.name)
					}
					
					})
					artist1[a.name] = tags
					//console.log(i)
					///after all data from artist 1 is collected sift through data 2
					if (count1 === 49) {
						//console.log('pass')
						lfm.artist.getSimilar({
							'artist' : a2,
							'limit': 50
							}, function (err, track) {
								if (err) { throw err; }
								else{
									var count2=0
										track.artist.map(function(a, i){
										lfm.artist.getTopTags({
											'artist' : a.name
										}, function (err, tag) {
											//console.log(tag)
											var tags=[];
											tag.tag.map(function(data){
												if(tags.length<10){
													tags.push(data.name)
												}
											});
											artist2[a.name] = tags
											// console.log("i is", i, ", track.artist.length is", track.artist.length)
											if (count2===49) {
												//look for exact matches
												var artists=[];
												for(var key1 in artist1){
													//console.log(key)
													for(var key2 in artist2){
														if(key1===key2){
															same.push(key1)
														}
													}
												}
												if(artists.length<10){
													console.log('2')
													
												 	for(var key1 in artist1){
												 		for(var key2 in artist2){											
												 			if(_.intersection(artist1[key1],artist2[key2]).length>n){
												 				if(!_.intersection(artists),key1){
												 					artists.push(key1)
												 					if(!_.intersection(artists),key2){
												 						artists.push(key2)
												 					}
												 				}
												 			}
												 		}
													}
													console.log(artists.length)
													if(!artists.length){
													// 	console.log(Object.keys(artist1)[0])
													// 	console.log(Object.keys(artist2)[0])
													// if(times<3){
														n--
														getRelated(Object.keys(artist1)[20],Object.keys(artist2)[20],n)
														// times++
													// }
													// else{
													// 	n--;
													// 	getRelated(a1,a2,n)
													// }
													}
													for(var m=0; m<artists.length && m<20; m++){
														//console.log('m')
														getArtists(artists[m])
													}
												}
												else{
													//console.log('152')
													for(var m=0; m<same.length && m<20; m++){
														//console.log('m')
														getArtists(same[m])
													}
												}
											}
											count2++
										});
								  	});
								}
							}
						);
					}
					count1++
				});
		  	});
		}
	}
);
}

getRelated('Metallica','Taylor Swift',6)
