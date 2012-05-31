App.Game = function()
{
    var
        rules = App.Instances.rules,
        board = App.Instances.board,
        Self  = {}, path;

    Self =
    {
        onDragStart: function()
        {
            board.table.bind("onDragStart", function(e)
            {
                Self.getPathByType( e );
            });
        },

        onDragStop: function()
        {
            board.table.bind("onDragStop", function(e)
            {
                board.setCellsAsDefault( path );
            });
        },

        onDrop: function()
        {
            board.table.bind("onDrop", function(e)
            {
                var
                    from = board.getCoordsByCell( e.drag ),
                    to   = board.getCoordsByCell( e.drop, true );

                board.moveCell.apply( board, from.concat( to ) );

                e.drop.empty().append( e.drag.css({top: "", left: ""}) );
            });
        },

        getPathByType: function(e)
        {
            var
                type   = e.obj.data( "type" ),
                coords = board.getCoordsByCell( e.obj );

            switch (type)
            {
                case "pawn":   { path = rules.pawnPath   .apply( null, coords ); } break;
                case "rook":   { path = rules.rookPath   .apply( null, coords ); } break;
                case "knight": { path = rules.knightPath .apply( null, coords ); } break;
                case "bishop": { path = rules.bishopPath .apply( null, coords ); } break;
                case "queen":  { path = rules.queenPath  .apply( null, coords ); } break;
                case "king":   { path = rules.kingPath   .apply( null, coords ); } break;
            }

            board.setCellsAsAvailable( path );

            console.log( type + " :", path );

            return path;
        }
    };

    Self.onDragStart();
    Self.onDragStop();
    Self.onDrop();
};