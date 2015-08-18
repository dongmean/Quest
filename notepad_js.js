var Page = function(tab, save, newFile, open){
	this.tab = tab;
	this.bindtab = null;
	this.bindfile =null;

    this.save = save;
    this.newFile = newFile;
    this.open = open;

    this.fileList = [];
    this.tabList = [];
    this.tabNum = 0;
    this.currenttab = null;
    this.clickedtab = null;

	this.initialize();
};
var _ = Page.prototype;

_.initialize = function(){
	this.bindEvents();
}

_.bindEvents = function(){
    var that = this;
    
    this.newFile.addEventListener('click', function(){
    	var tabnote = new Tabnote(page, that.tabNum);

        var tabtitle = new Tabtitle(page, tabnote, that.tabNum);

        that.bindtab = new Bindtab(tabtitle, tabnote, that.tabNum);


        console.log(that.tabNum);
        that.currenttab = that.tabNum;
        that.clickedtab = that.tabNum;


        that.tabList.push(that.bindtab);
        that.tabList[that.clickedtab].tabtitle.dom.style.zIndex = 100;
        that.tabList[that.clickedtab].tabtitle.dom.style.backgroundColor = "#D2D2FF";
        that.tabList[that.clickedtab].tabnote.dom.style.zIndex = 100;

        if(that.tabList.length>1){
        	for(i=0;i<that.tabList.length-1;i++){
        	that.tabList[i].tabtitle.dom.style.zIndex = that.tabList[i].tabNum;
        	that.tabList[i].tabtitle.dom.style.backgroundColor = "#7878FF";
        	that.tabList[i].tabnote.dom.style.zIndex = that.tabList[i].tabNum;
        	}
        }


        that.tabNum++;
    });

    this.save.addEventListener('click',function(){

    	if(that.tabList.length === 0){
    		alert("편집중인 텍스트가 없습니다")
    	}
    	else{

	    	var filename = prompt('파일명을 적어주세요');
	    	for(i=0;i<that.fileList.length;i++){
				if(filename===that.fileList[i].filename){
					filename=null;
					alert('해당파일명의 텍스트가 이미 존재합니다');
				}
			}

	    	if(filename !== null){
		    				    	
				var filecontent = null;

		    	that.bindtab.name = filename;
		    	
		    	filecontent = document.getElementById('tabnote'+that.clickedtab).value;

		    	var XHR = new XMLHttpRequest();
		    	XHR.open('POST', 'http://localhost:8888/save', true);
		    	XHR.onreadystatechange = function(){
		    		if(XHR.readyState ===4 && XHR.status ===200){
		    			alert("저장된 파일명 : '"+filename+"'");

		    			that.bindfile = new Bindfile(filename,filecontent);
		    			that.fileList.push(that.bindfile);

		    			var sp = that.tabList.splice(that.clickedtab,1);
		    			
		    			sp = null;
		    			var parentNode = document.querySelector(".tab");
		    			
		    			parentNode.removeChild(document.getElementById('tabnote'+that.clickedtab));
		    			parentNode.removeChild(document.getElementById('tabtitle'+that.clickedtab));

		    			that.tabNum--;

		    			if(that.tabList.length>0){
			    				that.clickedtab =  that.tabList[that.tabList.length-1].tabNum;

			    			console.log(that.clickedtab+' : clilckedtab');

			    			that.tabList[that.clickedtab].tabtitle.dom.style.zIndex = 100;
			    			that.tabList[that.clickedtab].tabtitle.dom.style.backgroundColor = "#D2D2FF";
			      			that.tabList[that.clickedtab].tabnote.dom.style.zIndex = 100;
		      			}
		    		}
		    	}
		    	var data = "title="+filename+"&content="+filecontent;
		    	console.log(data);
		    	XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		    	XHR.send(data);
	    	}
    	}
    });

    this.open.addEventListener('click', function(){

    	var openfile = 'filename='+prompt('file name : ');

    	console.log(openfile+' : openfile??')

    	var n;

    	for(i=0;i<that.fileList.length;i++){
			if(openfile!==('filename='+that.fileList[i].filename)){
				n=null;
			}
		}

		if(n===null){
			alert('해당파일이 존재하지 않습니다');
		}

		if(n!==null){
	    	var tabnote = new Tabnote(page, that.tabNum);

	        var tabtitle = new Tabtitle(page, tabnote, that.tabNum);

	        that.bindtab = new Bindtab(tabtitle, tabnote, that.tabNum);

	        console.log(that.tabNum);

	        that.currenttab = that.tabNum;

	        that.tabList.push(that.bindtab);

	        console.log(that.currenttab + " : open....")

	        that.tabList[that.currenttab].tabtitle.dom.style.zIndex = 100;
	        that.tabList[that.currenttab].tabtitle.dom.style.backgroundColor = "#D2D2FF";
	        that.tabList[that.currenttab].tabnote.dom.style.zIndex = 100;

	        if(that.tabList.length>1){
	        	for(i=0;i<that.tabList.length-1;i++){
	        	that.tabList[i].tabtitle.dom.style.zIndex = that.tabList[i].tabNum;
	        	that.tabList[i].tabtitle.dom.style.backgroundColor = "#7878FF";
	        	that.tabList[i].tabnote.dom.style.zIndex = that.tabList[i].tabNum;
	        	}
	        }

	        that.tabNum++;

	    	var XHR = new XMLHttpRequest();
	    	XHR.open('POST', 'http://localhost:8888/open', true);
	    	XHR.onreadystatechange = function(){
	    		if(XHR.readyState ===4 && XHR.status ===200){
	    			console.log(that.currenttab+'open clicked');
	    			console.log(XHR.responseText+'open text')
	    			document.getElementById('tabnote'+(that.currenttab)).value = XHR.responseText;
	    		}
	    	}
	    	XHR.send(openfile);

    	}
    });
	
}

var Bindfile = function(filename, filecontent){
	this.filename = filename;
	this.filecontent = filecontent;
	//this.name = null;
}


var Bindtab = function(tabtitle, tabnote, tabNum){
	this.tabtitle = tabtitle;
	this.tabnote = tabnote;
	this.tabNum = tabNum;
	this.name = null;
}


var Tabnote = function(page, tabNum){
	this.page = page;
	this.dom=null;
	this.name = null;
	this.tabNum = tabNum;
	this.content = null;
	this.initialize_Tabnote();
}

var _ = Tabnote.prototype;

_.initialize_Tabnote = function(){
	this.setDom();
}

_.setDom = function(){
	this.dom = document.createElement('textarea');
	this.dom.className = 'tabnote';
	this.dom.id = 'tabnote'+this.tabNum;
	this.page.tab.appendChild(this.dom);
}





var Tabtitle = function(page, tabnote, tabNum){
    this.page = page;
    this.tabnote = tabnote;
    this.tabNum = tabNum;
    this.dom = null;
    this.name = null;
    this.initialize_Tabtitle();
}

var _=Tabtitle.prototype;

_.initialize_Tabtitle = function(){
    this.setDom();
    this.bindEvents();
}

_.setDom = function(){

    this.dom = document.createElement('div');
    this.dom.className = 'tabtitle';
    this.dom.id = 'tabtitle'+this.tabNum;
    this.page.tab.appendChild(this.dom);
}

_.bindEvents = function(){
	var that = this;
	this.dom.addEventListener('click', function(){

		that.page.clickedtab=that.tabNum;
    	for(i=0;i<that.page.tabList.length;i++){
    	that.page.tabList[i].tabtitle.dom.style.zIndex = that.page.tabList[i].tabNum;
    	that.page.tabList[i].tabtitle.dom.style.backgroundColor= "#7878FF";
    	that.page.tabList[i].tabnote.dom.style.zIndex = that.page.tabList[i].tabNum;
    	}

		that.tabnote.dom.style.zIndex = 100;
		that.dom.style.zIndex =100;
		that.dom.style.backgroundColor = "#D2D2FF";
	});
}
