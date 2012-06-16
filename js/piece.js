App.Piece = function( type, name, color, cell )
{
    this.type  = type;
    this.name  = name;
    this.color = color;
    this.obj   = null;

    if ( type && name && color )
    {
        this.draw( cell );
    }
};

App.Piece.prototype =
{
    draw: function( cell )
    {
        var obj = $( "<span>" + this.type + "</span>" );

        obj.attr( "data-type", this.name );
        obj.addClass( "piece piece-" + this.color );

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