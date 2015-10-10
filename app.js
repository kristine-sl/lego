angular.module( 'app', [ 'ui.bootstrap' ] )
    .controller( 'LegoController', function( $interval, $scope, $uibModal ) {

        $scope.alert = false; 
        var vm = this;

        vm.currentIteration = 0;
        vm.currentSection = 0;

        vm.iterations = [
            {
                sections: [
                    {
                        duration: 5,
                        timer: 0, 
                        running: false
                    },
                    {
                        duration: 180,
                        timer: 0,
                        running: false
                    },
                    {
                        duration: 720,
                        timer: 0,
                        running: false, 
                        alert: 360
                    },
                    {
                        duration: 900,
                        timer: 0,
                        running: false
                    }
                ]
            },
            {
                sections: [
                    {
                        duration: 900,
                        timer: 0,
                        running: false
                    },
                    {
                        duration: 180,
                        timer: 0,
                        running: false
                    },
                    {
                        duration: 720,
                        timer: 0,
                        running: false, 
                        alert: 360
                    },
                    {
                        duration: 900,
                        timer: 0,
                        running: false
                    }
                ]
            }
        ];

        vm.resetTimer = function() {
            var duration = vm.iterations[vm.currentIteration].sections[vm.currentSection].duration;
            vm.iterations[vm.currentIteration].sections[vm.currentSection].timer = duration; 
            setMinutesAndSeconds(duration); 
        }

        vm.resetTimer();

        function resetAllTimers() {

            for(var i = 0; i < vm.iterations.length; i++) {

                var sections = vm.iterations[i].sections;  

                for(var j = 0; j < sections.length; j++) {

                    sections[j].timer = sections[j].duration; 
                    sections[j].running = false; 
                }
            }

            var timer = vm.iterations[vm.currentIteration].sections[vm.currentSection].timer; 
            setMinutesAndSeconds( timer ); 
        }

        var intervalRunning = false;
        var interval; 

        function startInterval() {

            var sections = vm.iterations[ vm.currentIteration ].sections; 

            var noneRunning = true;

            interval = $interval( function() {

                var currentlyRunning = 0; 

                for( var i = 0; i < sections.length; i++ ){


                    if( sections[i].running ){

                        sections[i].timer--; 
                        currentlyRunning++;  
                    }

                    var section = sections[i]; 

                    if( 'alert' in section) {

                        var alertTime = section.duration - section.alert;

                        if ( section.timer == alertTime && !$scope.alert) {

                            vm.pauseTimer();
                            vm.openModal();
                            $scope.alert = true; 
                        }
                    }

                    if(sections[i].timer == 0) {
                        sections[i].running = false; 
                    }
                }

                setMinutesAndSeconds(vm.iterations[vm.currentIteration].sections[vm.currentSection].timer); 

                if( currentlyRunning == 0 && typeof interval !== 'undefined' ) {
                    $interval.cancel(interval);
                    intervalRunning = false; 
                } else {
                    intervalRunning = true; 
                }

            }, 1000);
        }

        vm.startTimer = function() {

            console.log('startTimer'); 

            if( !intervalRunning ){
                startInterval(); 
            }

            vm.iterations[vm.currentIteration].sections[vm.currentSection].running = true; 
        }

        vm.pauseTimer = function() {

            vm.iterations[vm.currentIteration].sections[vm.currentSection].running = false;
        }

        vm.changeIteration = function( iteration ) {
            vm.currentIteration = iteration; 
            vm.currentSection = 0; 
            resetAllTimers(); 
        }

        vm.changeSection = function( section ) {
            vm.currentSection = section;

            var timer = vm.iterations[vm.currentIteration].sections[vm.currentSection].timer; 

            if(timer == 0) {

                var duration = vm.iterations[vm.currentIteration].sections[vm.currentSection].duration; 
                vm.iterations[vm.currentIteration].sections[vm.currentSection].timer = duration; 
                timer = duration; 
            }

            setMinutesAndSeconds( timer ); 
        }

        function setMinutesAndSeconds( timer ) {
            vm.minutes = parseInt( timer / 60, 10 );
            vm.seconds = parseInt( timer % 60, 10 );
            //vm.minutes = vm.minutes < 10 ? '0' + vm.minutes : vm.minutes;
            vm.seconds = vm.seconds < 10 ? '0' + vm.seconds : vm.seconds;
        }

        $scope.animationsEnabled = true;

        vm.openModal = function(size) {

            vm.pauseTimer(); 

            var modalInstance = $uibModal.open({

              animation: $scope.animationsEnabled,
              templateUrl: 'modal-content.html', 
              controller: 'ModalInstanceController',
              size: size
            });
        }

        $scope.$on('modal-closed', function() {
            vm.startTimer(); 
        }); 

    } )

    .controller('ModalInstanceController', function( $rootScope, $scope, $modalInstance ) { 

        $scope.finished = function() {
            $modalInstance.close();
            $scope.alert = false;
            $rootScope.$broadcast('modal-closed'); 
        }

    } ); 

