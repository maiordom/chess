App.Board = function()
{
    this.cell_active   = null;
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

        this.setCellsColor();
    },

    setCellsAsAvailable: function(data)
    {
        for (var i = data.length; i--;)
        {
            this.getCell( data[i].x, data[i].y ).cell.droppable( "enable" );
        }
    },

    setCellsAsDefault: function(data)
    {
        for (var i = data.length; i--;)
        {
            this.getCell( data[i].x, data[i].y ).cell.droppable( "disable" );
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
            hoverClass: "cell-available",

            drop: function(e, ui)
            {
                var cell = $(e.target);

                Self.player = Self.queue_players[ Self.player ];

                table.trigger( $.Event("onDrop", {drop: cell, drag: ui.helper}) );

                Self.reversePlayer( Self.player );
            }
        });

        this.cells[i][j].cell.droppable( "disable" );
    },

    _setDrag: function(i, j, table, Self)
    {
        this.cells[i][j].piece.obj.draggable(
        {
            revert: "invalid",
            containment: this.table,

            start: function(e, ui)
            {
                Self.cell_active = ui.helper.parent().addClass("cell-nonebck");
                table.trigger( $.Event("onDragStart", {obj: ui.helper}) );
            },

            stop: function(e, ui)
            {
                Self.cell_active.removeClass("cell-nonebck");
                table.trigger( $.Event("onDragStop", {e: e, ui: ui}) );
            }
        });
    },

    drawBoard: function()
    {
        var board, container, back, tr, i, j;

        container = $("<div>").addClass("desk__container");
        board     = $("<div>").addClass("desk");
        back      = $("<div>").addClass("cell-background");

        for (i = 0; i < 8; i++)
        {
            tr = $("<div>").appendTo( board ).addClass("row");

            for (j = 0; j < 8; j++)
                $("<div class='cell'>").append( back.clone() ).appendTo( tr );
        }

        this.table     = board.appendTo( container );
        this.container = container.appendTo( "body" );
    },

    setCellsColor: function()
    {
        this.table.find(".row:even .cell:even, .row:odd .cell:odd").addClass("cell-white");
        this.table.find(".row:even .cell:odd,  .row:odd .cell:even").addClass("cell-black");
    },

    setPieces: function()
    {
        var tr = this.table.find(".row"), td, i, j;

        for (i = 8; i--;)
        {
            this.cells[i] = [];

            for (j = 0; j < 8; j++)
            {
                td = tr.eq(i).find(".cell");
                td.eq(j).attr("data-coords", j + "-" + (7 - i));

                this.cells[i][j] =
                {
                    cell:  td.eq(j),
                    piece: null
                };
            }
        }

        this.cells.reverse();
    }
};