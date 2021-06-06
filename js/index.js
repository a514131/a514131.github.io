var result=null;
var id = 2;
var flag = 0;
var my_address = "http://127.0.0.1:5000/";
var first_data = 0;
var second_data = 0;
var arrange_data=[0,0,0];
var arr_len = 0;
var canvas_width = 500;
var canvas_height = 500;


function inpaint(){
//	var hidden_div = document.getElementById("hidden_div");
//	var hidden_img = document.getElementById("hidden_img");
//	hidden_div.style.display = "block";
//	hidden_img.style.display = "block";
	console.log("into inpaint");
	id = 2;
}

function resolve(){
//	var hidden_div = document.getElementById("hidden_div");
//	var hidden_img = document.getElementById("hidden_img");
//	hidden_div.style.display = "none";
//	hidden_img.style.display = "block";
	id = 3;
}

function color(){
//	var hidden_div = document.getElementById("hidden_div");
//	var hidden_img = document.getElementById("hidden_img");
//	hidden_div.style.display = "none";
//	hidden_img.style.display = "block";
	id = 1;
}

function btnUploadFile(e,type){
    var files = e.target.files;
    var file = files[0];
    if (!/\/(?:jpeg|jpg|png)/i.test(file.type)){
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function() { 
        result = this.result;  
        var img = new Image();
        img.src=result;
        var canvas = document.getElementById("canvas");
        var hidden_canvas = document.getElementById("hidden_canvas");
        var context = canvas.getContext("2d");
        var hidden_context = hidden_canvas.getContext("2d");
        //console.log(result)
        img.onload = function(){
            context.drawImage(img,0,0,canvas_width,canvas_height);
            hidden_context.drawImage(img,0,0,canvas_width,canvas_height);
            var imgData = hidden_context.getImageData(0,0,canvas_width,canvas_height);
			first_data = imgData.data;
			second_data = first_data;
			console.log(first_data);
        }
    };
    reader.readAsDataURL(file);    
}

function flip(){
	
	// 图像镜像翻转
	var canvas = document.getElementById("canvas");
	var hidden_canvas = document.getElementById("hidden_canvas");
	console.log("翻转开始");
	var context = canvas.getContext('2d');
	var hidden_context = hidden_canvas.getContext("2d");
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	var hidden_imgData = hidden_context.getImageData(0,0,canvas_width,canvas_height);
	first_data = hidden_imgData.data;
	//console.log(first_data);
	for(var i=0;i<canvas_height;i++)
	{
		for(var j=0;j<canvas_width;j++)
		{
			second_data[(i*canvas_width+j)*4] = first_data[(i*canvas_width+canvas_width-j-1)*4];
			second_data[(i*canvas_width+j)*4+1] = first_data[(i*canvas_width+canvas_width-j-1)*4+1];
			second_data[(i*canvas_width+j)*4+2] = first_data[(i*canvas_width+canvas_width-j-1)*4+2];
			second_data[(i*canvas_width+j)*4+3] = first_data[(i*canvas_width+canvas_width-j-1)*4+3];
		}
	}
	for(var i=0;i<first_data.length;i++)
	{
		first_data[i] = second_data[i];
		imgData.data[i] = second_data[i];
	}
	console.log(imgData.data);
	console.log(first_data);
	context.putImageData(imgData,0,0);
	hidden_context.putImageData(hidden_imgData,0,0);
	console.log("翻转结束");
	change();
	
}

function flip_result(){
	
	// 图像镜像翻转
	var canvas = document.getElementById("img");
	console.log("翻转开始");
	var context = canvas.getContext('2d');
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	var one_data = imgData.data;
	var data=[];
	//console.log(first_data);
	for(var i=0;i<canvas_height;i++)
	{
		for(var j=0;j<canvas_width;j++)
		{
			data[(i*canvas_width+j)*4] = one_data[(i*canvas_width+canvas_width-j-1)*4];
			data[(i*canvas_width+j)*4+1] = one_data[(i*canvas_width+canvas_width-j-1)*4+1];
			data[(i*canvas_width+j)*4+2] = one_data[(i*canvas_width+canvas_width-j-1)*4+2];
			data[(i*canvas_width+j)*4+3] = one_data[(i*canvas_width+canvas_width-j-1)*4+3];
		}
	}
	for(var i=0;i<one_data.length;i++)
	{
		one_data[i] = data[i];
	}
	context.putImageData(imgData,0,0);
	console.log("翻转结束");
	
}

function changeLight(){
	
	console.log("调节亮度开始");
	var value = document.getElementById('range').value ;
  	document.getElementById('value').innerHTML = value;
  	console.log("亮度为："+value);
	var context = canvas.getContext('2d');
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	var data = imgData.data;
	for(var i=0;i<data.length;i+=4)
	{
		if(value>0)
		{
			data[i] = first_data[i]+(255-first_data[i])*value*0.5;
			data[i+1] = first_data[i+1]+(255-first_data[i+1])*value*0.5;
			data[i+2] = first_data[i+2]+(255-first_data[i+2])*value*0.5;
		}
		else
		{
			data[i] = first_data[i]+first_data[i]*value*0.5;
			data[i+1] = first_data[i+1]+first_data[i+1]*value*0.5;
			data[i+2] = first_data[i+2]+first_data[i+2]*value*0.5;
		}
		
	}
	//console.log(data);
	context.putImageData(imgData,0,0);
	console.log("调节亮度结束");
	
}

function changeRadio(){
	
	console.log("调节对比度开始");
	var value = document.getElementById('radio_range').value ;
  	document.getElementById('radio_value').innerHTML = value;
  	console.log("对比度为："+value);
	var context = canvas.getContext('2d');
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	var data = imgData.data;
	for(var i=0;i<data.length;i+=4)
	{
		data[i] = arrange_data[0] + (1+value*0.5)*(second_data[i]-arrange_data[0]);
		data[i+1] = arrange_data[1] + (1+value*0.5)*(second_data[i+1]-arrange_data[1]);
		data[i+2] = arrange_data[2] + (1+value*0.5)*(second_data[i+2]-arrange_data[2]);
	}
	//console.log(data);
	//console.log(Math.abs(first_data[0]-arrange_data[0]));
	context.putImageData(imgData,0,0);
	console.log("调节对比度结束");
	
}

function change()
{
	changeLight();
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	second_data = imgData.data;
	arr_len = 0;
	arrange_data = [0,0,0];
	for(var i=0;i<second_data.length;i+=4)
	{
		arr_len += 1;
		arrange_data[0] += second_data[i];
		arrange_data[1] += second_data[i+1];
		arrange_data[2] += second_data[i+2];
	}
	arrange_data[0] /= arr_len;
	arrange_data[1] /= arr_len;
	arrange_data[2] /= arr_len;
	//console.log(arrange_data);
	changeRadio();
}

// 将base64转换成file对象
function dataURLtoFile (dataurl) {
	filename = "file";
	var arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let suffix = mime.split("/")[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      	u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${suffix}`, {type: mime});
}

function getmask()
{
	var canvas = document.getElementById("canvas");
	var hidden_canvas = document.getElementById("hidden_canvas");
	var context = canvas.getContext('2d');
	var hidden_context = hidden_canvas.getContext("2d");
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	var hidden_imgData = hidden_context.getImageData(0,0,canvas_width,canvas_height);
	var after_data = imgData.data;   // 涂改后的图片
	var first_data = hidden_imgData.data;  // 原图
	var img = document.getElementById("img");
	var img_context = img.getContext("2d");
	var mask_data = img_context.getImageData(0,0,canvas_width,canvas_height);
	var mask = mask_data.data;
	console.log(after_data);
	console.log(first_data);
	for(var i=0;i<first_data.length;i+=4)
	{
		if((after_data[i]-first_data[i])!=0||(after_data[i+1]-first_data[i+1])!=0||
			(after_data[i+2]-first_data[i+2])!=0)
		{
			mask[i] = 255;
			mask[i+1] = 255;
			mask[i+2] = 255;
		}
		else
		{
			mask[i] = 0;
			mask[i+1] = 0;
			mask[i+2] = 0;
		}
		mask[i+3] = 255;
	}
	console.log(mask);
	img_context.putImageData(mask_data,0,0);
}

function save(){
	// 保存修复前图片
	var before_repair = document.getElementById("before_repair_"+id);
	before_repair.src = hidden_canvas.toDataURL();
	var before_repair_look = document.getElementById("before_repair_look_"+id);
	before_repair_look.href = hidden_canvas.toDataURL();
	// 设置下载链接
	var before_repair_save = document.getElementById("before_repair_save_"+id);
	before_repair_save.href = hidden_canvas.toDataURL();
	before_repair_save.download = "before_repair";
	// 保存修复后图片
    var after_repair = document.getElementById("after_repair_"+id);
	after_repair.src = img.toDataURL();
	var after_repair_look = document.getElementById("after_repair_look_"+id);
	after_repair_look.href = img.toDataURL();
	// 设置下载链接
	var after_repair_save = document.getElementById("after_repair_save_"+id);
	after_repair_save.href = img.toDataURL();
	after_repair_save.download = "after_repair";
}

function repair(){
	
	getmask();
	var canvas = document.getElementById("canvas");
	var hidden_canvas = document.getElementById("hidden_canvas");
	var img = document.getElementById("img");
	console.log("修复开始");
	var context = canvas.getContext('2d');
	var hidden_context = hidden_canvas.getContext("2d");
	var img_context = img.getContext("2d");
	var imgData = context.getImageData(0,0,canvas_width,canvas_height);
	var hidden_imgData = hidden_context.getImageData(0,0,canvas_width,canvas_height);
	var after_data = imgData.data;   // 涂改后的图片
	var first_data = hidden_imgData.data;  // 原图
	var image = dataURLtoFile(hidden_canvas.toDataURL());
	var j = 0;
	
	if(result==null)
	{
		alert("请上传图片");
	}
	else{
		if(id==2&&flag==0)
		{
			alert("图像修复时需要用画笔在修复区域进行涂写");
		}
		else
		{
			var formData = new FormData();
			console.log(image);
			console.log(typeof(image));
			formData.append("image",image);
			formData.append("flag",id);
			if(id==2)
			{
				var ms = dataURLtoFile(img.toDataURL());
				formData.append("mask",ms);
			}
			//ajax请求
			$.ajax({
			   	type: "post",
			   	url: my_address,
			   	data: formData,
			   	processData: false, // 告诉jQuery不要去处理发送的数据
			   	contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			   	xhrFields:{withCredentials:true},
			   	async: true, //默认是true：异步，false：同步。
			   	success: function (data) {
			   		var image1 = new Image();
			   		image1.src = data;
			   		image1.onload = function(){
			            img_context.drawImage(image1,0,0,canvas_width,canvas_height);
			            
			        }
			   		var hidden_img = document.getElementById("hidden_result");
					hidden_img.style.display = "block";
			    	//img_context.putImageData(other_data);
			    	//alert("成功！");
			    	
			   	},
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				    console.log(XMLHttpRequest.status);//状态码
				    console.log(XMLHttpRequest.readyState);//状态
				    console.log(textStatus);//错误信息
				},
			});
			console.log(id);
		}
	}
}

function login(){
	var username = document.getElementById("email1").value;
	var uname = document.getElementById("uname");
	console.log(username);
	var close = document.getElementById("close");
	
	close.click();
	uname.innerText = username;
}


$(function(){
	draw();
	$("[name='btn_color']").click(function(){
		$("#hid_color").val(this.value);
		draw();
	});
	
	$("[name='rad_size']").click(function(){
		draw();
	});
	 
	$("#btn_clear").click(function(){
		//用clearRect方法清空画布，
		document.getElementById('canvas').getContext("2d").clearRect(0,0,$("#canvas").attr("width"),$("#canvas").attr("height"));
		var img = new Image();
        img.src=result;
		var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        flag = 0;
        //console.log(result)
        img.onload = function(){
            context.drawImage(img,0,0,canvas_width,canvas_height);
        }
	});
//  var canvas = document.getElementById("canvas");
//  var context = canvas.getContext("2d");
//  paint(context);
});

function draw(){
 
	var drawflag = false;
	var canvas = document.getElementById('canvas');
	var cxt = canvas.getContext('2d');
 
	//指定颜色
	cxt.strokeStyle= $("#hid_color").val(); 
	//指定尺寸
	cxt.lineWidth=$("input[name='rad_size']:checked").val();
 
	//开始绘画
	canvas.onmousedown = function(event) {
		flag = 1;
		drawflag = true;
		cxt.beginPath();
		
		cxt.moveTo(event.offsetX, event.offsetY);	
		console.log(event.offsetX,event.offsetY);
	}
 
	//结束绘画
	canvas.onmouseup = function(event) {
		drawflag = false;
		cxt.closePath();
	}
 
	//鼠标移动,绘画
	canvas.onmousemove = function(event) {
		if(drawflag) {
			cxt.lineTo(event.offsetX, event.offsetY);
			cxt.stroke();
		}
	}
}


function paint(context){
    var temp = false;
    $("canvas").mousedown(function(event){
        temp=true;
        var x = e.pageX-8;
        var y = e.pageY-8;
        context.moveTo(x,y);
    })
    $("canvas").mousemove(function(e){
        var x = e.pageX-8;
        var y = e.pageY-8;
        //$("#info").html("( "+x+" , "+y+" )");
        if(temp){
            context.lineTo(x,y);
            context.stroke();
        }else{
            context.beginPath()
        }
    })
    $("canvas").mouseup(function(e){
        temp=false;
    })
}