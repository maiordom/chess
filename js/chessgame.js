App.Game = function()
{
    var
        TPath  = App.Instances.path,
        TBoard = App.Instances.board,
        TRules = App.Instances.rules,
        Self   = {};

    Self =
    {
        curr_path: [],

        messages:
        {
            white: ['black_check', 'white_win'],
            black: ['white_check', 'black_win']
        },

        onDragStart: function()
        {
            TBoard.table.bind("onDragStart", function(e)
            {
                Self.drawPiecePath( e );
            });
        },

        onDragStop: function()
        {
            TBoard.table.bind("onDragStop", function()
            {
                TBoard.setCellsAsDefault( Self.curr_path );
            });
        },

        onDrop: function()
        {
            TBoard.table.bind("onDrop", function(e)
            {
                var
                    from   = TBoard.getCoordsByCell( e.drag ),
                    to     = TBoard.getCoordsByCell( e.drop, true ),
                    coords = from.concat( to );

                TBoard.moveCell.apply( TBoard, coords );
                TBoard.setMovedPath.apply( TBoard, coords );
                TRules.pawnChecking( coords[2], coords[3] );

                if (TRules.isKingDanger( TBoard.player ))
                {
                    alert( Self.messages[ TBoard.queue_players[ TBoard.player ] ][ TRules.isEnd( TBoard.player ) ] );
                }

                e.drop.find(".piece").remove();
                e.drop.append( e.drag.css({top: "", left: ""}) );
            });
        },

        drawPiecePath: function(e)
        {
            var
                path   = [],
                type   = e.obj.attr( "data-type" ),
                coords = TBoard.getCoordsByCell( e.obj );

            path = TPath.getPathByType( coords[0], coords[1], type );

            TRules.deleteForbiddenMoves( coords[0], coords[1], TBoard.player, path );

            TBoard.setCellsAsAvailable( path );

            Self.curr_path = path;

            console.log( type + " :", {data: path} );

            return path;
        }
    };

    Self.onDragStart();
    Self.onDragStop();
    Self.onDrop();
};