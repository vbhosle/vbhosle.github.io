$(document).ready(function(){
	var imageDir='images/';
	var imageFormat='.jpg';
	var IDCount=0;
	var $cardsAreaElem=$('#cards-container');
	var $addButtonElem=$('#cat-add');
	var $selectCatElem=$('#cat-list');
	
	$addButtonElem.click(function(){
		var catName = $selectCatElem.val();
		var catID = 'cat-'+IDCount;
		IDCount = IDCount+1;
		$newCat=$.parseHTML('<section class="cat-card" id="'+catID+'">'+
				'<span class="close-button" id="close-button-'+IDCount+'">&times;</span>'+
				'<h2 class="cat-name">'+catName+'</h2>'+
				'<div class="cat-image"><img src="'+imageDir+catName+imageFormat+'" ></div>'+
				'<div class="cat-controls">'+
					'<span class="counter" id="counter-'+IDCount+'">0</span>'+
					'<span class="reset" id="reset-'+IDCount+'">RESET</span>'+
				'</div>'+
			'</section>');
		
		$($newCat).appendTo($cardsAreaElem).children('.cat-image').click((function(ID,counter){
			console.log('#'+ID+'>.counter');
			var counter=0;
			return function(){
				counter = counter+1;
				$('#counter-'+ID).text(counter);
				$('#reset-'+ID).click(function(){
						counter=0;
						$('#counter-'+ID).text(counter);
					});
				}
		})(IDCount,0));
		
		$('#close-button-'+IDCount).click(function(){
				$(this).parent().remove();
			});
		
	});
	console.log('loaded');
});