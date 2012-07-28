App.Rules = function( board, path )
{
    var
        TBoard = board,
        TPath  = path,
        Self   = {};

    Self =
    {
        pawnChecking: function( from_x, from_y, to_x, to_y )
        {
            var
                cell   = TBoard.getCell( to_x, to_y ),
                player = TBoard.player,
                name   = cell.piece.name,
                result = {};

            result.new_queen  = false;
            result.en_passant = false;

            if ( name === "pawn" )
            {
                if ( to_y === ( player === "black" ? 7 : 0 ) )
                {
                    TBoard.setNewQueen( to_x, to_y );

                    result.new_queen = true;
                }

                if ( Math.abs( from_y - to_y ) === 2 )
                {
                    result.en_passant =
                    {
                        x:    to_x,
                        y:    player === "white" ? to_y + 1 : to_y - 1,
                        cell: cell
                    };
                }
            }

            TPath.setEnPassant( result.en_passant );

            return result;
        },

        isEnd: function()
        {
            var player = TBoard.player, cell;

            for ( var i = 0; i < 8; i++ )
            for ( var j = 0; j < 8; j++ )
            {
                cell = TBoard.getCell( i, j );

                if ( cell.piece )
                {
                    if ( cell.piece.color === player )
                    {
                        Self.curr_path = TPath.getPathByType( i, j, cell.piece.name );

                        Self.deleteForbiddenMoves( i, j, Self.curr_path );

                        if ( Self.curr_path.length > 0 )
                        {
                            return 0;
                        }
                    }
                }
            }

            return 1;
        },

        deleteForbiddenMoves : function( from_x, from_y, path )
        {
            var to_x, to_y, i = 0;

            while ( i < path.length )
            {
                to_x = path[ i ].x;
                to_y = path[ i ].y;

                if ( Self.isForbidden( from_x, from_y, to_x, to_y ) )
                {
                    path.splice( i, 1 );
                }
                else
                {
                    i++;
                }
            }
        },

        isForbidden: function( from_x, from_y, to_x, to_y )
        {
            var
                start = TBoard.getCell( from_x, from_y ).piece,
                end   = TBoard.getCell( to_x, to_y ).piece,
                is_check;

            TBoard.moveCell( from_x, from_y, to_x, to_y );

            is_check = Self.isKingDanger();

            TBoard.setPiece( from_x, from_y, start );
            TBoard.setPiece( to_x, to_y, end );

            return is_check;
        },


        isKingUnderAttack: function( x, y, shift, player )
        {
            var path, x_diff, y_diff, piece, xi, yi, color;

            path = [].concat( TPath.knightPath( x, y ), TPath.queenPath( x, y ) );

            for ( var i = 0; i < path.length; i++ )
            {
                xi = path[ i ].x;
                yi = path[ i ].y;

                if ( TBoard.getCell( xi, yi ).piece )
                {
                    y_diff = Math.abs( y - yi ),
                    x_diff = Math.abs( x - xi ),
                    piece  = TBoard.getCell( xi, yi ).piece.name;
                    color  = TBoard.getCell( xi, yi ).piece.color;

                    if
                    (
                        ( x_diff == 0 || y_diff == 0 ) &&
                        (
                            ( x_diff == 1 || y_diff == 1 ) &&
                            ( piece == "king" )
                            ||
                            piece == "queen" || piece == "rook"
                        )
                        ||
                        ( x_diff == y_diff ) &&
                        (
                            (
                                x_diff == 1 &&
                                ( piece == "king" || piece == "pawn" && y - path[ i ].y == shift )
                            )
                            ||
                            piece == "queen" || piece == "bishop"
                        )
                        ||
                        (
                            piece == "knight" &&
                            ( x_diff == 2 && y_diff == 1 || x_diff == 1 && y_diff == 2 )
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

        isKingDanger: function()
        {
            var
                player = TBoard.player,
                shift  = player === "white" ? -1 : 1, cell;

            for ( var i = 0; i < 8; i++ )
            for ( var j = 0; j < 8; j++ )
            {
                cell = TBoard.getCell( i, j );

                if ( cell.piece !== null )
                {
                    if ( cell.piece.name  === "king" &&
                         cell.piece.color === player )
                    {
                        return Self.isKingUnderAttack( i, j, shift, player );
                    }
                }
            }

            return false;
        }
    };

    return Self;
};