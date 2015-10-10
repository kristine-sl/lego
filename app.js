angular.module( 'app', [] )
    .controller( 'LegoController', function( $interval ) {
        var vm = this;

        vm.timer = 0;
        vm.countingDown = false;
        vm.minutes = 0;
        vm.seconds = 0;
        vm.currentIteration = 0;
        vm.currentSection = 0;
        vm.iterations = [
            {
                sections: [
                    {
                        duration: 1800,
                        alerts: [
                            {
                                after: 10,
                                text: 'Hello world'
                            }
                        ]
                    },
                    {
                        duration: 180
                    },
                    {
                        duration: 720
                    },
                    {
                        duration: 900
                    }
                ]
            },
            {
                sections: [
                    {
                        duration: 900
                    },
                    {
                        duration: 180
                    },
                    {
                        duration: 720
                    },
                    {
                        duration: 900
                    }
                ]
            }
        ];

        var interval;

        vm.startTimer = function( iteration, section ) {
            vm.countingDown = true;
            var section = vm.iterations[ iteration ].sections[ section ];

            if ( vm.timer == 0 ) {
                vm.timer = section.duration;
            }

            interval = $interval( function() {
                vm.minutes = parseInt( vm.timer / 60, 10 );
                vm.seconds = parseInt( vm.timer % 60, 10 );

                vm.minutes = vm.minutes < 10 ? '0' + vm.minutes : vm.minutes;
                vm.seconds = vm.seconds < 10 ? '0' + vm.seconds : vm.seconds;

                if ( section.alerts.length > 0 ) {
                    for ( var index = 0; index < section.alerts.length; index ++ ) {
                        var alertTime = section.duration - section.alerts[ index ].after;
                        if ( vm.timer == alertTime ) {
                            vm.pauseTimer();
                            alert( section.alerts[ index ].text );
                        }
                    }
                }

                vm.timer --;
            }, 1000 );
        }

        vm.pauseTimer = function() {
            vm.countingDown = false;
            $interval.cancel( interval );
        }

    } );