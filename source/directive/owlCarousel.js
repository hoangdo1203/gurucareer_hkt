app.directive('owlCarousel',function(){
	var linker = function(scope, element, attr){
		$(element).owlCarousel(scope.owlOptions);
		var loadCarouselActions = function(){
			angular.element("#next").click(function(){
				element.trigger('next.owl.carousel');
			})
			angular.element("#prev").click(function(){
				element.trigger('prev.owl.carousel');
			})
		}
		loadCarouselActions();
	}
	return{
		restrict : "A",
		link: linker
	}
});