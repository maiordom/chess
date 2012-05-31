$(document).ready(function()
{
    var
        board = new App.Board(),
        rules = App.Rules( board.cells );

    App.Instances =
    {
        board: board,
        rules: rules
    };

    App.Game();
});