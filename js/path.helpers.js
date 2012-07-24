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
            this.getCell( x, y ).piece &&
            this.getCell( x, y ).piece.color !== color;
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
    }
});