cc.Class({
    extends: cc.Component,

    properties: {

        gameLayer:{
            default:null,
            type:cc.Node,
        },
    },



    // use this for initialization
    onLoad: function () {
       


    },

    start:function() {
       
    },

    backClick:function() {
        cc.director.loadScene('selectCheckpoint');
    },

    reNewClick:function() {
        this.gameLayer.getComponent("gameLayer").reNew();
    },

   

});
