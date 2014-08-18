App.Start = function() {
    this.area       = $( ".b-area");
    this.btn_demo   = $( ".b-btn__demo" );
    this.btn_friend = $( ".b-btn__friend" );
    this.btn_ai     = $( ".b-btn__ai" );
};

App.Start.prototype = {
    onOpenDemo: function( callback ) {
        var Self = this;

        this.btn_demo.click( function() {
            Self.hide();
            callback();
        });
    },

    onPlayWithFriend: function( callback ) {
        var Self = this;

        this.btn_friend.click( function() {
            Self.hide();
            callback();
        });
    },

    onPlayWithAi: function( callback ) {
        var Self = this;

        this.btn_ai.click( function() {
            Self.hide();
            callback();
        });
    },

    hide: function() {
        this.area.hide();
    }
};