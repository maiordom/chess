App.Rules = function( board, path )
{
    var
        TBoard = board,
        TPath  = path,
        Self   = {};

    Self =
    {
        pawnChecking: function( to_x, to_y )
        {
            var
                cell = TBoard.getCell( to_x, to_y ),
                name = cell.piece.name;

            if ( name === "pawn" )
            {
                if ( to_y === ( TBoard.player === "black" ? 7 : 0 ) )
                {
                    TBoard.setNewQueen( to_x, to_y );
                }
            }
        },

        isEnd: function( player )
        {
            var cell;

            for ( var i = 0; i < 8; i++ )
            for ( var j = 0; j < 8; j++ )
            {
                cell = TBoard.getCell( i, j );

                if ( cell.piece )
                {
                    if ( cell.piece.color === player )
                    {
                        Self.curr_path = TPath.getPathByType( i, j, cell.piece.name );

                        Self.deleteForbiddenMoves( i, j, player, Self.curr_path );

                        if ( Self.curr_path.length > 0 )
                        {
                            return 0;
                        }
                    }
                }
            }

            return 1;
        },

        deleteForbiddenMoves : function( from_x, from_y, player, path )
        {
            var to_x, to_y, i = 0;

            while ( i < path.length )
            {
                to_x = path[ i ].x;
                to_y = path[ i ].y;

                if ( Self.isForbidden( from_x, from_y, to_x, to_y, player ) )
                {
                    path.splice( i, 1 );
                }
                else
                {
                    i++;
                }
            }
        },

        isForbidden: function( from_x, from_y, to_x, to_y, player )
        {
            var
                is_check,
                start = TBoard.getCell( from_x, from_y ).piece,
                end   = TBoard.getCell( to_x, to_y ).piece;

            TBoard.moveCell( from_x, from_y, to_x, to_y );

            is_check = Self.isKingDanger( player );

            TBoard.setPiece( from_x, from_y, start );
            TBoard.setPiece( to_x, to_y, end );

            return is_check;
        },


        isKingUnderAttack: function( x, y, player )
        {
            var shift, path, xdiff, ydiff, piece, xi, yi, color;

            shift = player === "white" ? -1 : 1;
            path  = [].concat( TPath.knightPath( x, y ), TPath.queenPath( x, y ) );

            for ( var i = 0; i < path.length; i++ )
            {
                xi = path[ i ].x;
                yi = path[ i ].y;

                if ( TBoard.getCell( xi, yi ).piece )
                {
                    ydiff = Math.abs( y - yi ),
                    xdiff = Math.abs( x - xi ),
                    piece = TBoard.getCell( xi, yi ).piece.name;
                    color = TBoard.getCell( xi, yi ).piece.color;

                    if
                    (
                        ( xdiff == 0 || ydiff == 0 ) &&
                        (
                            ( xdiff == 1 || ydiff == 1 ) &&
                            ( piece == "king" )
                            ||
                            piece == "queen" || piece == "rook"
                        )
                        ||
                        ( xdiff == ydiff ) &&
                        (
                            (
                                xdiff == 1 &&
                                ( piece == "king" || piece == "pawn" && y - path[ i ].y == shift )
                            )
                            ||
                            piece == "queen" || piece == "bishop"
                        )
                        ||
                        (
                            piece == "knight" &&
                            ( xdiff == 2 && ydiff == 1 || xdiff == 1 && ydiff == 2 )
                        )
                    )
                    {
                        if ( player !== color )
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        },

        isKingDanger: function( player )
        {
            var cell;

            for ( var i = 0; i < 8; i++ )
            for ( var j = 0; j < 8; j++ )
            {
                cell = TBoard.getCell( i, j );

                if ( cell.piece !== null )
                {
                    if ( cell.piece.name  === "king" &&
                         cell.piece.color === player )
                    {
                        return Self.isKingUnderAttack( i, j, player );
                    }
                }
            }

            return false;
        }
    };

    return Self;
};