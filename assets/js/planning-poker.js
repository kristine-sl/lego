angular.module( 'planning-poker', [ 'ui.bootstrap' ] )
    .controller( 'PokerController', function( $scope, $uibModal, Card ) {

    	var vm = this; 

    	vm.cards = [
    		'0', 		'1/2',	'1', 		'2', 		
    		'3',		'5', 		'8', 		'13',		
    		'20',		'40', 		'100', 		'∞', 
    		'?'
    	]; 

    	$scope.currentCard = '?'; 
    	$scope.animationsEnabled = true;

    	vm.openModal = function(card, size) {

    		Card.set( card ); 
    		console.log($scope.currentCard); 

            var modalInstance = $uibModal.open({

              animation: $scope.animationsEnabled,
              templateUrl: 'poker-modal-content.html', 
              controller: 'PokerModalInstanceController',
              size: size

            });
        }

 	} )

 	.controller('PokerModalInstanceController', function( $scope, $modalInstance, Card ) { 

        $scope.finished = function() {
            $modalInstance.close();
        }

        $scope.getCard = function() {
        	return Card.get(); 
        }

    } )

    .factory('Card', function() {

    	var currentCard; 

    	function get() {
    		return currentCard;
    	}

    	function set( card ){
    		currentCard = card; 
    	}

    	return {
    		get: get, 
    		set: set
    	}

    }); 
