App.Board = function()
{
    this.king_danger   = false;
    this.cells         = [];
    this.table         = null;
    this.container     = null;
    this.colors        = ["white", "black"];
    this.letters       = ["A", "B", "C", "D", "E", "F", "G", "H"];
    this.pieces        = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜", "♟"];
    this.pnames        = ["rook", "knight" , "bishop", "queen", "king", "bishop", "knight", "rook", "pawn"];
    this.player        = "white";
    this.queue_players = {white: "black", black: "white"};

    this.init();
};

App.Board.prototype =
{
    init: function()
    {
        this.drawBoard();
        this.setPieces();
        this.drawPieces();
        this.setDragAndDrop();
        this.reversePlayer( "white" );
    },

    setNewQueen: function(x, y)
    {
        var cell = this.getCell(x, y);

        cell.piece =
        {
            color: this.queue_players[ this.player ],
            type:  this.pieces[3],
            obj:   cell.piece.obj.text( this.pieces[3] ).attr("data-type", "queen"),
            name:  "queen"
        };
    },

    reversePlayer: function(player)
    {
        for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++)
        {
            if (!this.getCell(i, j).piece) {continue;}

            this.getCell(i, j).piece.color !== player ?
                this.getCell(i, j).piece.obj.draggable("disable") :
                this.getCell(i, j).piece.obj.draggable("enable");
        }
    },

    getCell: function(x, y)
    {
        return this.cells[y][x];
    },

    setPiece: function(x, y, piece_obj)
    {
        this.cells[y][x].piece = piece_obj;
    },

    moveCell: function(from_x, from_y, to_x, to_y)
    {
        this.cells[to_y][to_x].piece     = this.cells[from_y][from_x].piece;
        this.cells[from_y][from_x].piece = null;
    },

    drawPieces: function()
    {
        var a = this, c = this.cells;

        for (var i = 0; i < 8; i++)
        {
            c[1][i].piece = new App.Piece( a.pieces[8], a.pnames[8], a.colors[0], c[1][i].cell );
            c[0][i].piece = new App.Piece( a.pieces[i], a.pnames[i], a.colors[0], c[0][i].cell );

            c[6][i].piece = new App.Piece( a.pieces[8], a.pnames[8], a.colors[1], c[6][i].cell );
            c[7][i].piece = new App.Piece( a.pieces[i], a.pnames[i], a.colors[1], c[7][i].cell );
        }

        this.ifIE();
    },

    setCellsAsAvailable: function(data)
    {
        for (var i = data.length; i--;)
        {
            this.getCell( data[i].x, data[i].y ).cell.addClass("available-cell");
        }
    },

    setCellsAsDefault: function(data)
    {
        for (var i = data.length; i--;)
        {
            this.getCell( data[i].x, data[i].y ).cell.removeClass("available-cell");
        }
    },

    getCoordsByCell: function(cell, is_parent)
    {
        cell = is_parent === true ? cell : cell.parent();

        var coords = cell.data("coords").match(/\d+/g);

        return [ parseInt( coords[0] ), parseInt( coords[1] ) ];
    },

    setDragAndDrop: function()
    {
        var table = this.table, Self = this, cell;

        for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++)
        {
            this._setDrop( i, j, table, Self );

            if (this.cells[i][j].piece === null) {continue;}

            this._setDrag( i, j, table, Self );
        }
    },

    _setDrop: function(i, j, table, Self)
    {
        this.cells[i][j].cell.droppable(
        {
            drop: function(e, ui)
            {
                var cell = $(e.target);

                if (cell.hasClass("available-cell"))
                {
                    Self.player = Self.queue_players[ Self.player ];

                    table.trigger( $.Event("onDrop", {drop: cell, drag: ui.helper}) );

                    Self.reversePlayer( Self.player );
                }
                else
                {
                    ui.helper.animate({top: 0, left: 0}, 500);
                }
            }
        });
    },

    _setDrag: function(i, j, table, Self)
    {
        this.cells[i][j].piece.obj.draggable(
        {
            revert: "invalid",
            containment: this.table,

            start: function(e, ui)
            {
                table.trigger( $.Event("onDragStart", {obj: ui.helper}) );
            },

            stop: function(e, ui)
            {
                table.trigger( $.Event("onDragStop", {e: e, ui: ui}) );
            }
        });
    },

    drawBoard: function()
    {
        var board, container, tr, i, j;

        container = $("<div>").addClass("desk__container");
        board     = $("<table>").addClass("desk");

        for (i = 0; i < 8; i++)
        {
            tr = $("<tr>").append("<td>" + ( 8 - i ) + "</td> ").appendTo( board );

            for (j = 0; j < 8; j++)
                $("<td class='cell'></td>").appendTo( tr );
        }

        tr = $("<tr>").append("<td>").appendTo( board );

        for (i = 0; i < 8; i++)
            tr.append("<td>" + this.letters[i] + "</td>");

        this.table     = board.appendTo( container );
        this.container = container.appendTo( "body" );
    },

    ifIE: function()
    {
        if ($.browser.msie)
        {
            this.table.find("tr:even .cell:even, tr:odd .cell:odd").addClass("white-cell");
            this.table.find("tr:even .cell:odd,  tr:odd .cell:even").addClass("black-cell");
            this.table.find("tr:last td").addClass("border-none");
            this.table.find("td:first").addClass("border-none");
        }
    },

    setPieces: function()
    {
        var tr = this.table.find("tr"), td, i, j;

        for (i = 8; i--;)
        {
            this.cells[i] = [];

            for (j = 0; j < 8; j++)
            {
                td = tr.eq(i).find("td");
                td.eq(j + 1).attr("data-coords", j + "-" + (7 - i));

                this.cells[i][j] =
                {
                    cell:  td.eq(j + 1),
                    piece: null
                };
            }
        }

        this.cells.reverse();
    }
};