$.extend( App.Path.prototype,
{
    kingPath: function( x, y )
    {
        var
            arr  = [],
            path = [],
            cell = this.getCell( x, y );

        for ( var i = -1; i < 2; i++ )
        for ( var j = -1; j < 2; j++ )
        {
            arr = [ x + i, y + j, cell.piece.color ];

            if ( this.isMoveCorrect.apply( this, arr ) ||
                 this.isCellEmpty.apply( this, arr ) )
            {
                path.push( App.Point.apply( null, arr ) );
            }
        }

        return path;
    },

    isAvailableCastling: function( x, y )
    {
        var
            cell   = this.getCell( x, y ),
            result = {};

        result =
        {
            left_path:  {},
            right_path: {}
        };

        if ( cell.piece.available_castling )
        {
            result.left_path  = this.isPathToCastlingEmpty( x, y, -1 );
            result.right_path = this.isPathToCastlingEmpty( x, y,  1 );
        }

        console.log( "Доступные ходы для рокировки короля", result );

        return result;
    },

    isPathToCastlingEmpty: function( x, y, shift )
    {
        var king_pos = 4, result = { path: [], empty: false };

        while ( king_pos > 1 && king_pos < 6 )
        {
            king_pos += shift;

            if ( this.getCell( king_pos, y ).piece )
            {
                return result;
            }

            if ( x !== king_pos )
            {
                result.path.push( App.Point( king_pos, y ) );
            }
        }

        result.empty = true;

        return result;
    }
});