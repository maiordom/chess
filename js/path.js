App.Path = function( cells )
{
    this.cells = cells;
};

App.Path.prototype = 
{
    getLine: function( x, y, xShift, yShift, path )
    {
        var color = this.getCell( x, y ).piece.color;

        while ( x + xShift >= 0 && x + xShift < 8 && y + yShift >= 0 && y + yShift < 8 )
        {
            x += xShift;
            y += yShift;

            if ( this.getCell( x, y ).piece )
            {
                if ( this.getCell( x, y ).piece.color !== color )
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
        this.getLine( x, y, -1,  0, path );
        this.getLine( x, y,  1,  0, path );
        this.getLine( x, y,  0, -1, path );
        this.getLine( x, y,  0,  1, path );

        return path;
    },

    getDiagonalPath: function( x, y, path )
    {
        this.getLine( x, y, -1, -1, path );
        this.getLine( x, y,  1,  1, path );
        this.getLine( x, y, -1,  1, path );
        this.getLine( x, y,  1, -1, path );

        return path;
    },

    rookPath: function( x, y )
    {
        return this.getHorVerPath( x, y, [] );
    },

    bishopPath: function( x, y )
    {
        return this.getDiagonalPath( x, y, [] );
    },

    queenPath: function( x, y )
    {
        var path = [];

        this.getHorVerPath( x, y, path );

        return this.getDiagonalPath( x, y, path );
    },

    knightPath: function( x, y )
    {
        var
            path     = [],
            arr      = [],
            x_shift  = 2,
            y_shift  = 1,
            color    = this.getCell( x, y ).piece.color;

        for ( var i = 0; i < 8; i++ )
        {
            ( i % 2 ) === 0 ? x_shift = -x_shift : y_shift = -y_shift;

            arr = [ x + x_shift, y + y_shift, color, color ];

            if ( this.isMoveCorrect.apply( this, arr ) ||
                 this.isCellEmpty.apply( this, arr ) )
            {
                path.push( App.Point.apply( null, arr ) );
            }

            if ( i === 3 )
            {
                x_shift = 1;
                y_shift = 2;
            }
        }

        return path;
    },

    pawnPath: function( x, y )
    {
        var
            path   = [],
            color  = this.getCell( x, y ).piece.color,
            shift  = color === "white" ? 1 : -1,

            one    = [ x, y + shift ],
            double = [ x, y + 2 * shift ],
            left   = [ x - 1, y + shift, color ],
            right  = [ x + 1, y + shift, color ];

        if ( this.isCellEmpty.apply( this, one ) )
        {
            path.push( App.Point.apply( null, one ) );

            if ( color === "white" && y === 1 ||
                 color === "black" && y === 6 )
            {
                if ( this.isCellEmpty.apply( this, double ) )
                {
                    path.push( App.Point.apply( null, double ) );
                }
            }
        }

        if ( this.tryPawnAttack.apply( this, left ) )  { path.push( App.Point.apply( null, left ) ); }
        if ( this.tryPawnAttack.apply( this, right ) ) { path.push( App.Point.apply( null, right ) ); }

        return path;
    },

    getPathByType: function( x, y, type )
    {
        var path = [];

        switch ( type )
        {
            case "pawn":   { path = this.pawnPath   ( x, y ); } break;
            case "rook":   { path = this.rookPath   ( x, y ); } break;
            case "knight": { path = this.knightPath ( x, y ); } break;
            case "bishop": { path = this.bishopPath ( x, y ); } break;
            case "queen":  { path = this.queenPath  ( x, y ); } break;
            case "king":   { path = this.kingPath   ( x, y ); } break;
        }

        console.log( "Ходы " + type + " до отсечения: ", path );

        return path;
    }
};