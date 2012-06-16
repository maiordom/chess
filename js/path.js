App.Path = function( cells )
{
    var Self =
    {
        cells: cells,

        getLine: function( x, y, xShift, yShift, path )
        {
            var color = Self.getCell( x, y ).piece.color;

            while ( x + xShift >= 0 && x + xShift < 8 && y + yShift >= 0 && y + yShift < 8 )
            {
                x += xShift;
                y += yShift;

                if ( Self.getCell( x, y ).piece )
                {
                    if ( Self.getCell( x, y ).piece.color !== color )
                    {
                        path.push( App.Point( x, y ) );
                    }

                    return path;
                }

                path.push( App.Point( x, y ) );
            }

            return path;
        },

        getHorVerPath: function( x, y, path )
        {
            Self.getLine( x, y, -1,  0, path );
            Self.getLine( x, y,  1,  0, path );
            Self.getLine( x, y,  0, -1, path );
            Self.getLine( x, y,  0,  1, path );

            return path;
        },

        getDiagonalPath: function( x, y, path )
        {
            Self.getLine( x, y, -1, -1, path );
            Self.getLine( x, y,  1,  1, path );
            Self.getLine( x, y, -1,  1, path );
            Self.getLine( x, y,  1, -1, path );

            return path;
        },

        getCell: function( x, y )
        {
            return Self.cells[ y ][ x ];
        },

        inScope: function( x, y )
        {
            return x >= 0 && x < 8 && y >= 0 && y < 8;
        },

        isCellEmpty: function( x, y )
        {
            return Self.inScope( x, y ) && Self.getCell( x, y ).piece === null;
        },

        tryPawnAttack: function( x, y, color )
        {
            return Self.inScope( x, y ) &&
                   Self.getCell( x, y ).piece &&
                   Self.getCell( x, y ).piece.color !== color;
        },

        isMoveCorrect: function( x, y, color )
        {
            if ( Self.inScope( x, y ) && Self.getCell( x, y ).piece )
            {
                if ( Self.getCell( x, y ).piece.color !== color )
                {
                    return true;
                }
            }

            return false;
        },

        rookPath: function( x, y )
        {
            return Self.getHorVerPath( x, y, [] );
        },

        bishopPath: function( x, y )
        {
            return Self.getDiagonalPath( x, y, [] );
        },

        queenPath: function( x, y )
        {
            var path = [];

            Self.getHorVerPath( x, y, path );

            return Self.getDiagonalPath( x, y, path );
        },

        kingPath: function( x, y )
        {
            var arr = [], path = [], cell = Self.getCell( x, y );

            for ( var i = -1; i < 2; i++ )
            for ( var j = -1; j < 2; j++ )
            {
                arr = [ x + i, y + j, cell.piece.color ];

                if ( Self.isMoveCorrect.apply( null, arr ) ||
                     Self.isCellEmpty.apply( null, arr ) )
                {
                    path.push( App.Point.apply( null, arr ) );
                }
            }

            return path;
        },

        knightPath: function( x, y )
        {
            var
                path  = [], arr = [], xShift = 2, yShift = 1,
                color = Self.getCell( x, y ).piece.color;

            for ( var i = 0; i < 8; i++ )
            {
                ( i % 2 ) == 0 ? xShift = -xShift : yShift = -yShift;

                arr = [ x + xShift, y + yShift, color, color ];

                if ( Self.isMoveCorrect.apply( null, arr ) ||
                     Self.isCellEmpty.apply( null, arr ) )
                {
                    path.push( App.Point.apply( null, arr ) );
                }

                if ( i == 3 )
                {
                    xShift = 1;
                    yShift = 2;
                }
            }

            return path
        },

        pawnPath: function( x, y )
        {
            var
                path  = [],
                color = Self.getCell( x, y ).piece.color,
                shift = color === "white" ? 1 : -1,

                one    = [ x, y + shift ],
                double = [ x, y + 2 * shift ],
                left   = [ x - 1, y + shift, color ],
                right  = [ x + 1, y + shift, color ];

            if ( Self.isCellEmpty.apply( null, one ) )
            {
                path.push( App.Point.apply( null, one ) );

                if ( color === "white" && y === 1 ||
                     color === "black" && y === 6 )
                {
                    if ( Self.isCellEmpty.apply( null, double ) )
                    {
                        path.push( App.Point.apply( null, double ) );
                    }
                }
            }

            if ( Self.tryPawnAttack.apply( null, left ) )  { path.push( App.Point.apply( null, left ) ); }
            if ( Self.tryPawnAttack.apply( null, right ) ) { path.push( App.Point.apply( null, right ) ); }

            return path;
        },

        getPathByType: function( x, y, type )
        {
            var path = [];

            switch ( type )
            {
                case "pawn":   { path = Self.pawnPath   .apply( null, [ x, y ] ); } break;
                case "rook":   { path = Self.rookPath   .apply( null, [ x, y ] ); } break;
                case "knight": { path = Self.knightPath .apply( null, [ x, y ] ); } break;
                case "bishop": { path = Self.bishopPath .apply( null, [ x, y ] ); } break;
                case "queen":  { path = Self.queenPath  .apply( null, [ x, y ] ); } break;
                case "king":   { path = Self.kingPath   .apply( null, [ x, y ] ); } break;
            }

            return path;
        }
    };

    return Self;
};