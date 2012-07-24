App.Test = function()
{
    var Self = {};

    Self =
    {
        test1: function()
        {
            var i = 0, timer, selector;

            timer = setInterval( function()
            {
                selector = i > 7 ?
                    ".cell[data-coords='" + ( i++ - 8 ) + "-1']" :
                    ".cell[data-coords='" + i++ + "-0']";

                App.Instances.board.movePieceToTomb( $( selector ).find( ".piece" ) );

                if ( i >= 16 )
                {
                    clearInterval( timer );
                    console.log( "test1" );
                }

            }, 700 );
        },

        test2: function()
        {
            var coords = [], i = 0, timer;

            coords =
            [
                ".cell[data-coords='1-0']",
                ".cell[data-coords='2-0']",
                ".cell[data-coords='3-0']"
            ];

            timer = setInterval( function()
            {
                App.Instances.board.movePieceToTomb( $( coords[ i++ ] ).find(".piece") );
                App.Instances.board.removeCell( i, 0 );

                if ( i === 3 )
                {
                    clearInterval( timer );
                }

            }, 700 );
        },

        test3: function()
        {
            var coords = [], i = 0, timer;

            coords =
            [
                ".cell[data-coords='5-0']",
                ".cell[data-coords='6-0']"
            ];

            timer = setInterval( function()
            {
                App.Instances.board.movePieceToTomb( $( coords[ i++ ] ).find(".piece") );
                App.Instances.board.removeCell( i + 4, 0 );

                if ( i === 2 )
                {
                    clearInterval( timer );
                }

            }, 700 );
        }
    };

    return Self;
};