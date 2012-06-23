App.Test = function()
{
    var Self = {};

    Self =
    {
        test1: function()
        {
            var i = 0, timer, selector;

            timer = setInterval(function()
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
        }
    };
};