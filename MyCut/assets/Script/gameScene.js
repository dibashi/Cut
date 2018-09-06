cc.Class({
    extends: cc.Component,

    properties: {

        gameLayer: {
            default: null,
            type: cc.Node,

        },

        background: {
            default: null,
            type: cc.Node,

        },

       uiLayer:{
           default:null,
           type:cc.Node,
       },


       

     


        teachingNode: {
            default: null,
            type: cc.Node
        },


    },



    // use this for initialization
    onLoad: function () {
     
    
      console.log("game scene on load");
      
      cc.director.getPhysicsManager().enabled = true; //开启物理系统，否则在编辑器里做的一切都没有任何效果
      cc.director.getPhysicsManager().debugDrawFlags = //cc.PhysicsManager.DrawBits.e_aabbBit |
          //cc.PhysicsManager.DrawBits.e_pairBit |
         // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //  cc.PhysicsManager.DrawBits.e_jointBit |
          cc.PhysicsManager.DrawBits.e_shapeBit; //开启物理调试信息
     // cc.director.getPhysicsManager().debugDrawFlags = 0; //-设置为0则关闭调试
      cc.director.getPhysicsManager().gravity = cc.v2(0, -320);//-320像素/秒的平方，这个是默认值，为了以后调试先放在这
        
       


    },

    start:function() {
       
       // console.log("game scenen on start");
    },

   

  

   

    
   
    
});
