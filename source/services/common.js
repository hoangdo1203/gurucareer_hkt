'use strict';
app.service('CommonSV', function() {
	var objSVSD = {};
	
	objSVSD.clear = function(){
    	localStorage.clear();
    };
    
    objSVSD.setItem = function ( attr , arr){
		localStorage.setItem( attr , JSON.stringify(arr) );	
    };
    objSVSD.getItem = function(attr){
		var result = localStorage.getItem( attr );
    	if (result !== 'undefined') {
    		result = JSON.parse( result);
    		return result;	
    	}
    	else {
    		return '';
    	}
    	
    };
    
    objSVSD.logout = function(){
    	window.location.href = "#signin/";
    	objSVSD.clear();
    }
    
    return objSVSD;
});