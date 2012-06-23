App.Piece = function( name, color, cell )
{
    this.name  = name;
    this.color = color;
    this.obj   = null;

    if ( name && color )
    {
        this.draw( cell );
    }
};

App.Piece.prototype =
{
    draw: function( cell )
    {
        var obj = $( "<span>" );

        obj.attr( "data-type", this.name );
        obj.addClass( "piece piece-" + this.color + " piece__" + this.name );

        cell.append( obj );

        this.obj = obj;
    }
};

App.Point = function( x, y )
{
    return {
        x: x,
        y: y
    }
};