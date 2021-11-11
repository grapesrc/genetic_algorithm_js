var canvas = document.getElementById("main")
var ctx = canvas.getContext("2d")

var obj_p_x = 700;
var obj_p_y = 100;
const obj_p_w = 40;
const obj_p_h = 40;

var obj_x = []
var obj_y = []
const obj_w = 25
const obj_h = 25
const obj_n = 20 //オブジェクトの個数

var obj_gx = []
var obj_gy = []

var g_len = 50 //遺伝子の長さ

var spx = 10 //スタート地点
var spy = 300

//読み込まれたら実行するやつ
window.onload = function(){
    //初期化
    for(var i = 0;i < obj_n;i++){
        obj_x.push(spx)
        obj_y.push(spy)
    }

    //とりあえずランダムな数字を入れる
    var obj_tmp_x = []
    var obj_tmp_y = []
    for(var i = 0;i < obj_n;i++){
        for(var j = 0;j < g_len;j++){
            obj_tmp_x.push(Math.random()*4-2)
            obj_tmp_y.push(Math.random()*4-2)
        }
        obj_gx.push(obj_tmp_x)
        obj_gy.push(obj_tmp_y)
        obj_tmp_x = []
        obj_tmp_y = []
    }
}

function draw_obj_p(){
    ctx.beginPath()
    ctx.rect(obj_p_x,obj_p_y,obj_p_w,obj_p_h)
    ctx.fillStyle = "#ff0000"
    ctx.fill()
    ctx.closePath()
}

function draw_obj(){
    for(var i = 0;i < obj_x.length;i++){
        ctx.beginPath()
        ctx.rect(obj_x[i],obj_y[i],obj_w,obj_h)
        ctx.fillStyle = "#00ff00"
        ctx.fill()
        ctx.closePath()
    }
}

var gm = 0;
function main(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    draw_obj_p()
    draw_obj()
    
    if(gm < 20){
        for(var i = 0;i < obj_gx.length;i++){
            for(var j = 0;j < obj_gx[i].length;j++){
                obj_x[i] += obj_gx[i][gm]
                obj_y[i] += obj_gy[i][gm]
            }
        }
        gm++
    }else{

        var obj_gx_tmp = []
        var obj_gy_tmp = []

        sleep(500)

        //一番目的地に近かったオブジェクト(x)
        var mn_x = m_near(obj_x,obj_p_x)
        //二番目に目的地に近かったオブジェクト(x)
        var sn_x = second_near(obj_x,obj_p_x)

        //一番目と二番目の遺伝子をごちゃまぜにしてすごいものを作り直す(x)
        for(var i = 0;i < obj_gx.length;i++){
            obj_gx_tmp.push(make_new_obj(obj_gx[mn_x],obj_gx[sn_x],obj_gx[i]))
        }
        obj_gx = obj_gx_tmp


        //y**********************


        //一番目的地に近かったオブジェクト(y)
        var mn_y = m_near(obj_y,obj_p_y)
        //二番目に目的地に近かったオブジェクトy)
        var sn_y = second_near(obj_y,obj_p_y)

        //一番目と二番目の遺伝子をごちゃまぜにしてすごいものを作り直す(y)
        for(var i = 0;i < obj_gy.length;i++){
            obj_gy_tmp.push(make_new_obj(obj_gy[mn_y],obj_gy[sn_y],obj_gy[i]))
        }
        obj_gy = obj_gy_tmp


        obj_x = []
        obj_y = []
        for(var i = 0;i < obj_n;i++){
            obj_x.push(spx)
            obj_y.push(spy)
        }

        gm = 0
    }
}

main_interval = setInterval(main,80)



//遺伝的アルゴリズムのライブラリとかにできそう()


//sleep()
function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
}
//入力された値に最も近い数字をリストの中から選んで、そのリストが何番目かを返す
//m_near(input list,number)
function m_near(input_list,number){
    //それぞれのオブジェクトの座標 - 目的オブジェクト座標
    var subl = input_list.map(i => Math.abs(i - number))
    var tmp = 0;
    for(var i = 0;i < subl.length;i++){
        if(subl[tmp]>subl[i]){
            tmp = i
        }
    }
    return tmp
}

//二番目のやつ
function second_near(input_list,number){
    var mn = m_near(input_list,number)
    input_list[mn] = null
    return m_near(input_list,number)
}


//2つのリストをごちゃまぜにして返す
// value1.length = value2.length = before_value.length
// make_new_obj(value1[list] , value2[list],前の値[list])
function make_new_obj(value1,value2,before_value){
    var res_list = []
    var random_num = 0

    for(var i = 0;i < before_value.length;i++){
        random_num = Math.floor(Math.random() * (4 - 1) + 1); //1～3のランダムな数字を選ぶ

        /*

        1:
        value1の方の値を追加する

        2:
        value2の方の値を追加する

        3:
        そのままにする

        4:
        突然変異を入れる

        */
        switch(random_num){
            case 1:
                res_list.push(value1[i])
                break;
            case 2:
                res_list.push(value2[i])
                break;
            case 3:
                res_list.push(before_value[i])
                break;
            case 4:
                res_list.push(Math.random()*4-2)
                break;
            default:
                break;
        }
    }

    return res_list
}