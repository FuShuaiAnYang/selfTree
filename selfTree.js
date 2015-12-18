var SelfSelectTree = (function(){
    var getPre = function(ele){
        if(ele.previousElementSibling){
            return ele.previousElementSibling;
        }
        var pre = ele.previousSibling;
        while(pre && !pre.nodeType === 1){
            pre = pre.previousSibling;
        }
        return pre;
    }
    var getParentParentPrevious = function(ele){
        var pre = getPre(ele.parentNode.parentNode);
        return pre;
    }
    var getNext = function(ele){
        if(ele.nextElementSibling){
            return ele.nextElementSibling;
        }
        var next = ele.nextSibling;
        while(next && !next.nodeType === 1){
            next = next.nextSibling;
        }
        return next;
    }
    var getSiblings = function(ele){
        var nodes = ele.parentNode.childNodes, ary = [];
        for(var i=0;i<nodes.length;i++){
            var node = nodes[i];
            if(node.nodeType == 1 && node != ele){
                ary.push(node);
            }
        }
        return ary;
    }
    var initClass = function(self){
        var oCon = $('#tree-region .tree-menu').get(0);
        var oSpans = oCon.getElementsByTagName("span");
        for(var i=0;i<oSpans.length;i++){
            var oSpan = oSpans[i];
            var ppPre = getParentParentPrevious(oSpan);
            var next = getNext(oSpan.parentNode); //获取span的弟弟
            if(next && next.nodeName == "UL"){ //有并且是UL 
                next.style.display = self.open ? "block" : "none"; //父节点
                //next.style.display = "block";   //父节点
                oSpan.className = self.open ? "close" : "open";
                //oSpan.className = "close";
            }else{
                oSpan.className = "end";  //子节点
            }
            if(ppPre){
                if(ppPre.nodeName == "DIV"){
                    $(oSpan.parentNode).addClass("sj");
                }
            }
        }
    }
    var showTree = function(self){
        if (!$) {
            alert('无法正确使用jQuery类库');
        }
        self.treeRegion = $('<div id="tree-region"></div>');
        self.btnGroup = $('<div class="btn-group"></div>');
        self.btnGroupSpan = $('<span class="btn_group_span">--请选择--</span>');
        self.caret = $('<span class="caret"></span>');
        self.treeMenu = $('<div class="tree-menu"></div>');
        self.ul = $('<ul></ul>');
        if(self.data){
            for(var i = 0 ; i < self.data.length; i++){
                var item = self.data[i];
                var li = $("<li></li>");
                li.append("<div><span>"+item.name+"</span></div>");
                var children = item.children;
                if(children){
                    if(children.length){
                        var ul = $('<ul></ul>');
                        for(var j = 0; j < children.length; j++){
                            if(children[j].selected){
                                self.setValue(children[j].name, children[j].value);
                            }
                            var children_li = $("<li><span _value="+children[j].value+">"+children[j].name+"</span></li>");
                            ul.append(children_li);
                        }
                        li.append(ul);
                    }
                }
                self.ul.append(li);
            }
        } else {
            self.btnGroupSpan.get(0).innerHTML = "--请选择--";
            self.treeMenu.hide();
        }

        self.treeMenu.append(self.ul);

        self.btnGroup.append(self.btnGroupSpan);
        self.btnGroup.append(self.caret);

        self.treeRegion.append(self.btnGroup);
        self.treeRegion.append(self.treeMenu);

        if (self.contentId) {
            self.contentDiv = $('#' + self.contentId);
        } else {
            self.contentDiv = $('body');
        }
        self.contentDiv.append(self.treeRegion);

        if (self._load && typeof self._load == "function") {
            self._load(self);
        }
        return self;
    }
    var bindEvent = function(self){
        self.treeMenu.bind('click', function(e){
            e = e || window.event;
            var t = e.target || e.srcElement;
            if(t.nodeName == "SPAN"){
                var next = getNext(t.parentNode);
                if(next &&　next.nodeName == "UL"){
                    if(next.style.display == "none"){
                        next.style.display = "block";
                        t.className = "close cursor";
                    }else{
                        var oUls = t.parentNode.parentNode.getElementsByTagName("ul");
                        for(var i=0;i<oUls.length;i++){
                            var oUl = oUls[i];
                            oUl.style.display = "none";
                            getSiblings(oUl)[0].children[0].className = "open cursor";
                        }
                    }
                }
            }
            if(t.nodeName == "SPAN" && $(t).hasClass('end')){
                self.setValue(t.innerHTML,$(t).attr('_value'));
                self.treeMenu.hide();
            }
            
            e.stopPropagation();
        });

        self.btnGroup.bind('click', function (e) {
            if (self.treeMenu.is(":hidden")) {
                self.treeMenu.show();
            } else {
                self.treeMenu.hide();
            }
            e.stopPropagation();
        });

        $(document).bind('click', function (e) {
            e.target = e.target || e.srcElement;
            if (e.target != self.treeMenu) {
                self.treeMenu.hide();
            }
        });
    }
    return {
        init: function(opt){
            this.contentId = opt.contentId || "";
            this.data = opt.data;
            this.open = opt.open && true;
            //this.width = opt.width || "252px";
            this._change = opt.onchange || undefined;
            this._click = opt.onclick || undefined;
            this._load = opt.onload || undefined;

            showTree(this);

            initClass(this);

            bindEvent(this);
        },
        setValue: function(text, value){
            this.btnGroupSpan.get(0).innerHTML = text;
            this.btnGroupSpan.attr("selectValue", value);
            if (this._change && typeof this._change == "function") {
                this._change(this);
            }
        },
        getValue: function(){
            return this.btnGroupSpan.attr("selectValue");
        },
        getText: function(){
            return this.btnGroupSpan.get(0).innerHTML;
        }
    }
})();
