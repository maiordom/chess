$.extend( App.Path.prototype, {
    kingPath: function( x, y ) {
        var
            arr  = [],
            path = [],
            cell = this.getCell( x, y );

        for ( var i = -1; i < 2; i++ )
        for ( var j = -1; j < 2; j++ ) {
            arr = [ x + i, y + j, cell.piece.color ];

            if ( this.isMoveCorrect.apply( this, arr ) ||
                 this.isCellEmpty.apply( this, arr ) ) {
                path.push( App.Point.apply( null, arr ) );
            }
        }

        return path;
    },

    isAvailableCastling: function( x, y ) {
        var
            king_cell = this.getCell( x, y ),
            o = {
                left_path:  { path: [], empty: false, rook: false },
                right_path: { path: [], empty: false, rook: false }
            },
            rooks = {
                left_rook:  false,
                right_rook: false
            };

        if ( king_cell.piece.available_castling ) {
            rooks = this.isRookCastlingAvailable( y );

            o.left_path       = this.isPathToCastlingEmpty( x, y, -1 );
            o.right_path      = this.isPathToCastlingEmpty( x, y,  1 );
            o.left_path.rook  = rooks.left_rook;
            o.right_path.rook = rooks.right_rook;
        }

        console.log( "Доступные ходы для рокировки короля", o );

        return o;
    },

    isPathToCastlingEmpty: function( x, y, shift ) {
        var
            king_pos = 4,
            result   = {
                path:  [],
                empty: false,
            };

        while ( king_pos > 1 && king_pos < 6 ) {
            king_pos += shift;

            if ( this.getCell( king_pos, y ).piece ) {
                return result;
            }

            if ( x !== king_pos ) {
                result.path.push( App.Point( king_pos, y ) );
            }
        }

        result.empty = true;

        return result;
    },

    isRookCastlingAvailable: function( y ) {
        var o = {
            left_rook:  this.getCell( 0, y ).piece,
            right_rook: this.getCell( 7, y ).piece
        };

        if ( o.left_rook ) {
            o.left_rook = o.left_rook.name === "rook" && o.left_rook.available_castling;
        }

        if ( o.right_rook ) {
            o.right_rook = o.right_rook.name === "rook" && o.right_rook.available_castling;
        }

        return o;
    }
});