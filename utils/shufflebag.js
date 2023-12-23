var ShuffleBag = module.exports = function(items){

	var originalItems = prepareBag(items);
	var bag = [];

	function prepareBag(itemObject) {

		var itemArr = [];

		if(itemObject instanceof Array) {
			for (var i = 0; i < itemObject.length; i++) {
				itemArr.push(itemObject[i]);
			}
		} else {
			for(key in itemObject) {
				for(var i=0; i<itemObject[key]; i++) {
					itemArr.push(key);
				}
			}
		}
		
		return itemArr;
	}



	var shuffle = function(){
		bag = originalItems.slice(0);
		for (var i = 0; i < bag.length; i++) {
			swap(bag, i, Math.floor(Math.random() * bag.length));
		}
		

		function swap(arrt, a, b) {
			
			var t = arrt[a];
			arrt[a] = arrt[b];
			arrt[b] = t;
		}
	};
	
	
	shuffle(); // the initial shuffle

	return {
		next:function(){
			if(bag.length === 0) {
				shuffle();
			}
			return bag.shift();
		},
		reset:function() { // reset the bag
			shuffle();
			
		}
	}
}