$.extend( App.Path.prototype,
{
    getCell: function( x, y )
    {
        return this.cells[ y ][ x ];
    },

    inScope: function( x, y )
    {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    },

    isCellEmpty: function( x, y )
    {
        return this.inScope( x, y ) && this.getCell( x, y ).piece === null;
    },

    tryPawnAttack: function( x, y, color )
    {
        return this.inScope( x, y ) &&
        (
            (
                this.getCell( x, y ).piece &&
                this.getCell( x, y ).piece.color !== color
            )
            ||
            (
                this.en_passant.x === x &&
                this.en_passant.y === y
            )
        );
    },

    isMoveCorrect: function( x, y, color )
    {
        if ( this.inScope( x, y ) && this.getCell( x, y ).piece )
        {
            if ( this.getCell( x, y ).piece.color !== color )
            {
                return true;
            }
        }

        return false;
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
});